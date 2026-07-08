export const Icons = {
  arrowDownSignToNavigate: require('./arrow-down-sign-to-navigate.svg'),
  search: require('./search.png'),
  unfoldMore: require('./unfold-more.svg'),
  signinIllustration: require('./signin-illustration.svg'),
  signupIllustration: require('./signup-illustration.svg'),
  fingerprint: require('./fingerprint.svg'),
  eye: require('./eye.svg'),
  check: require('./check.svg'),
  creditCard: require('./credit-card.svg'),
  bankSame: require('./bank-same.svg'),
  bankOther: require('./bank-other.svg'),
  eAdd: require('./e-add.svg'),
} as const;

export type IconType = keyof typeof Icons;
