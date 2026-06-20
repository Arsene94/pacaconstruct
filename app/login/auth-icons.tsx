import type { SVGProps } from "react";

type AuthIconProps = SVGProps<SVGSVGElement> & {
  name:
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
};

export function AuthIcon({ name, ...props }: AuthIconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.8,
  } as const;

  const filled = {
    fill: "currentColor",
    stroke: "none",
  } as const;

  const paths = {
    architecture: (
      <>
        <path {...common} d="M4 20h16" />
        <path {...common} d="M7 20V9.5L12 4l5 5.5V20" />
        <path {...common} d="M9.5 20v-5h5v5" />
        <path {...common} d="M9 11h6" />
        <path {...common} d="M12 4v16" />
      </>
    ),
    arrowBack: <path {...common} d="M19 12H5m6-6-6 6 6 6" />,
    arrowForward: <path {...common} d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path {...common} d="m5 12 4 4L19 6" />,
    checkCircle: (
      <>
        <circle {...common} cx="12" cy="12" r="9" />
        <path {...common} d="m8 12.5 2.5 2.5L16.5 9" />
      </>
    ),
    error: (
      <>
        <circle {...common} cx="12" cy="12" r="9" />
        <path {...common} d="M12 7v6" />
        <path {...filled} d="M12 18.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z" />
      </>
    ),
    lock: (
      <>
        <rect {...common} x="5" y="10" width="14" height="10" rx="2" />
        <path {...common} d="M8 10V8a4 4 0 0 1 8 0v2" />
      </>
    ),
    login: (
      <>
        <path {...common} d="M10 17l5-5-5-5" />
        <path {...common} d="M15 12H3" />
        <path {...common} d="M14 4h4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-4" />
      </>
    ),
    mail: (
      <>
        <rect {...common} x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path {...common} d="m4.5 7 7.5 6 7.5-6" />
      </>
    ),
    support: (
      <>
        <path {...common} d="M4 12a8 8 0 0 1 16 0" />
        <path {...common} d="M4 12v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Z" />
        <path {...common} d="M20 12v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
        <path {...common} d="M17 17c0 2-2 3-5 3" />
      </>
    ),
    verified: (
      <>
        <path {...common} d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" />
        <path {...common} d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    visibility: (
      <>
        <path {...common} d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle {...common} cx="12" cy="12" r="3" />
      </>
    ),
    visibilityOff: (
      <>
        <path {...common} d="m3 3 18 18" />
        <path {...common} d="M10.6 6.2A10.3 10.3 0 0 1 12 6c6 0 9.5 6 9.5 6a15.8 15.8 0 0 1-3.1 3.8" />
        <path {...common} d="M15 15.2A4 4 0 0 1 8.8 9" />
        <path {...common} d="M6.5 6.8C3.9 8.4 2.5 12 2.5 12s3.5 6 9.5 6a9.8 9.8 0 0 0 4.5-1.1" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      {paths[name]}
    </svg>
  );
}
