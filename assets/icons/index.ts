export const Icons = {
  arrowDownSignToNavigate: require('./arrow-down-sign-to-navigate.svg'),
  search: require('./search.png'),
  unfoldMore: require('./unfold-more.svg'),
} as const;

export type IconType = keyof typeof Icons;
