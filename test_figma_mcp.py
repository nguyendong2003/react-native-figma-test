import json
import os
import subprocess
import time
import argparse
import re

# --- NPX FIGMA MCP GO CONFIGURATION ---
COMMAND = ["npx", "-y", "@vkhanhqui/figma-mcp-go"]

_mcp_process = None

def call_mcp_tool(tool_name, arguments={}):
    global _mcp_process
    
    # Start the process if not already running
    if _mcp_process is None or _mcp_process.poll() is not None:
        _mcp_process = subprocess.Popen(
            COMMAND,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1 # Line buffered
        )

    # Prepare JSON-RPC payload
    payload = {
        "jsonrpc": "2.0",
        "id": int(time.time() * 1000),
        "method": "tools/call",
        "params": {"name": tool_name, "arguments": arguments},
    }

    try:
        input_data = json.dumps(payload) + "\n"
        print(f"--> Sending MCP command: '{tool_name}'...")

        _mcp_process.stdin.write(input_data)
        _mcp_process.stdin.flush()

        stdout_data = _mcp_process.stdout.readline()

        if stdout_data:
            response_json = json.loads(stdout_data.strip())
            return response_json
        else:
            print("No response received from stdout.")
            return None

    except Exception as e:
        print(f"Error calling tool {tool_name}: {e}")
        return None

def sort_json_by_geometry(data):
    """
    Recursively sorts coordinates:
    Prioritizes vertical Y centers (rounded to nearest 4px) to handle align-center issues.
    If Y center matches, sorts left-to-right by X.
    """
    if isinstance(data, list):
        for item in data:
            sort_json_by_geometry(item)
        
        def get_sort_key(node):
            if isinstance(node, dict) and "bounds" in node:
                b = node["bounds"]
                x = b.get("x", 0)
                y = b.get("y", 0)
                height = b.get("height", 0)
                
                # Center Y Y-coordinate
                center_y = y + (height / 2)
                # Normalize to 4px grid
                normalized_center_y = round(center_y / 4) * 4
                return (normalized_center_y, round(x))
            return (0, 0)
        
        data.sort(key=get_sort_key)

    elif isinstance(data, dict):
        if "children" in data and isinstance(data["children"], list):
            sort_json_by_geometry(data["children"])
            
    return data

def make_it_pretty(raw_result):
    """
    Extracts the unescaped text content from the MCP server response.
    """
    try:
        content_list = raw_result.get("result", {}).get("content", [])
        if not content_list:
            return None

        first_content = content_list[0]
        if first_content.get("type") == "text" and "text" in first_content:
            clean_data = json.loads(first_content["text"])
            sorted_data = sort_json_by_geometry(clean_data)
            return sorted_data
    except Exception as e:
        print(f"[Warning: failed to make pretty]: {e}")
    return None

def slugify(text):
    """
    Slugifies names into clean kebab-case.
    Handles camelCase, PascalCase, spaces, and hyphens.
    """
    # Insert hyphens between lowercase/digits and uppercase letters
    text = re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', text)
    # Handle consecutive capitals (acronyms) followed by lowercase
    text = re.sub(r'([A-Z])([A-Z][a-z])', r'\1-\2', text)
    
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export Figma designs using figma-mcp-go.")
    parser.add_argument("-s", "--screen", type=str, help="Export selection as a screen with the given name")
    parser.add_argument("-c", "--component", type=str, help="Export selection as a common component with the given name")
    parser.add_argument("-t", "--styles", action="store_true", help="Export shared Figma styles only (no selection required)")
    args = parser.parse_args()

    output_dir = "output"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    styles_file = os.path.join(output_dir, "figma_styles.json")

    # Mode 1: Styles Only (does not require any figma selection)
    if args.styles:
        print("=== QUÉT STYLES CHUNG TỪ FIGMA (KHÔNG CẦN CHỌN NODE) ===")
        styles_result = call_mcp_tool("get_styles", {})
        if styles_result:
            pretty_styles = make_it_pretty(styles_result)
            if pretty_styles:
                with open(styles_file, "w", encoding="utf-8") as f:
                    json.dump(pretty_styles, f, indent=4, ensure_ascii=False)
                print(f"✅ Đã lưu Shared Styles: -> {styles_file}")
            else:
                print("❌ Lỗi khi format styles.")
        else:
            print("❌ Lỗi khi gọi tool get_styles.")
        
        if _mcp_process and _mcp_process.poll() is None:
            _mcp_process.kill()
        print("\n" + "=" * 50)
        print("🎉 HOÀN THÀNH XUẤT STYLES CHUNG!")
        print("=" * 50)
        exit(0)

    # Mode 2: Screen or Component Export (requires figma selection)
    print("=== BƯỚC 1: LẤY NODE ĐANG CHỌN TỪ FIGMA ===")
    selection_result = call_mcp_tool("get_selection", {})

    node_id = None
    node_name = "untitled"
    pretty_selection = None

    if selection_result:
        pretty_selection = make_it_pretty(selection_result)
        if pretty_selection and isinstance(pretty_selection, list) and len(pretty_selection) > 0:
            node_id = pretty_selection[0].get("id")
            node_name = pretty_selection[0].get("name", "untitled")
            print(f"🎯 Đã tìm thấy Node ID đang chọn: {node_id} (Tên: '{node_name}')\n")
        else:
            print("⚠️ LƯU Ý: Bạn chưa select node nào trên Figma Desktop.")

    if not node_id:
        print("❌ Lỗi: Không thể lấy node được chọn từ Figma Desktop. Hãy chọn một node và chạy lại.")
        if _mcp_process and _mcp_process.poll() is None:
            _mcp_process.kill()
        exit(1)

    # Determine mode and folders
    mode = None
    target_name = None

    if args.screen:
        mode = "screen"
        target_name = slugify(args.screen)
    elif args.component:
        mode = "component"
        target_name = slugify(args.component)
    else:
        # Auto-detect mode based on node name
        cleaned_node_name = node_name.lower()
        if "screen" in cleaned_node_name or "page" in cleaned_node_name or "view" in cleaned_node_name:
            mode = "screen"
        else:
            mode = "component"
        target_name = slugify(node_name)
        print(f"🤖 Tự động phát hiện loại node: {mode.upper()} -> Tên: '{target_name}'")

    # Set target folders
    if mode == "screen":
        target_dir = os.path.join(output_dir, target_name)
    else:
        target_dir = os.path.join(output_dir, "common", target_name)

    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    layout_file = os.path.join(target_dir, "layout.json")
    screenshot_file = os.path.join(target_dir, "screenshot.png")

    # Save selection layout.json
    with open(layout_file, "w", encoding="utf-8") as f:
        json.dump(pretty_selection, f, indent=4, ensure_ascii=False)
    print(f"✅ Đã lưu Layout JSON: -> {layout_file}")

    print("\n=== BƯỚC 2: QUÉT STYLES & LẤY SCREENSHOT ===")
    
    # 1. Export Figma common styles (always update style file as well)
    styles_result = call_mcp_tool("get_styles", {})
    if styles_result:
        pretty_styles = make_it_pretty(styles_result)
        if pretty_styles:
            with open(styles_file, "w", encoding="utf-8") as f:
                json.dump(pretty_styles, f, indent=4, ensure_ascii=False)
            print(f"✅ Đã lưu Shared Styles: -> {styles_file}")

    # 2. Export Screenshot using save_screenshots
    screenshot_abs_path = os.path.abspath(screenshot_file)
    print(f"--> Exporting screenshot to absolute path: {screenshot_abs_path}...")
    screenshot_result = call_mcp_tool("save_screenshots", {
        "items": [
            {
                "nodeId": node_id,
                "outputPath": screenshot_abs_path,
                "format": "PNG",
                "scale": 2
            }
        ]
    })
    
    if screenshot_result and not screenshot_result.get("result", {}).get("isError", False):
        print(f"✅ Đã lưu Screenshot: -> {screenshot_file}")
    else:
        print("❌ Lỗi khi xuất screenshot từ Figma.")

    # Close process
    if _mcp_process and _mcp_process.poll() is None:
        _mcp_process.kill()

    print("\n" + "=" * 50)
    print(f"🎉 HOÀN THÀNH XUẤT DỮ LIỆU FIGMA ({mode.upper()})!")
    print(f"📂 Thư mục đích: '{target_dir}/'")
    print("=" * 50)