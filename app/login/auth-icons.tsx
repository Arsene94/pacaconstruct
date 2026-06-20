import {
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconBuildingArch,
  IconCheck,
  IconCircleCheck,
  IconEye,
  IconEyeOff,
  IconHeadset,
  IconLock,
  IconLogin,
  IconMail,
  IconShieldCheck,
  type Icon as TablerIcon,
  type IconProps,
} from "@tabler/icons-react";

type AuthIconName =
  | "architecture"
  | "arrowBack"
  | "arrowForward"
  | "check"
  | "checkCircle"
  | "error"
  | "lock"
  | "login"
  | "mail"
  | "support"
  | "verified"
  | "visibility"
  | "visibilityOff";

type AuthIconProps = IconProps & {
  name: AuthIconName;
};

const icons: Record<AuthIconName, TablerIcon> = {
  architecture: IconBuildingArch,
  arrowBack: IconArrowLeft,
  arrowForward: IconArrowRight,
  check: IconCheck,
  checkCircle: IconCircleCheck,
  error: IconAlertCircle,
  lock: IconLock,
  login: IconLogin,
  mail: IconMail,
  support: IconHeadset,
  verified: IconShieldCheck,
  visibility: IconEye,
  visibilityOff: IconEyeOff,
};

export function AuthIcon({ name, ...props }: AuthIconProps) {
  const TablerComp = icons[name];
  return <TablerComp aria-hidden="true" {...props} />;
}
