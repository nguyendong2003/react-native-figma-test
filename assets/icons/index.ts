export const Icons = {
  arrowDownSignToNavigate: require('./arrow-down-sign-to-navigate.svg'),
  search: require('./search.png'),
  unfoldMore: require('./unfold-more.svg'),
  signinIllustration: require('./signin-illustration.svg'),
  signupIllustration: require('./signup-illustration.svg'),
  fingerprint: require('./fingerprint.svg'),
  eye: require('./eye.svg'),
  check: require('./check.svg'),
} as const;

export type IconType = keyof typeof Icons;
