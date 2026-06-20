import type { ReactNode, SVGProps } from "react";

export type AdminIconName =
  | "add"
  | "article"
  | "chevronLeft"
  | "download"
  | "edit"
  | "expandMore"
  | "filter"
  | "moreVert"
  | "openInNew"
  | "addTask"
  | "analytics"
  | "architecture"
  | "arrowForward"
  | "call"
  | "chevronRight"
  | "construction"
  | "dashboard"
  | "engineering"
  | "event"
  | "eventAvailable"
  | "eventNote"
  | "help"
  | "history"
  | "location"
  | "logout"
  | "mail"
  | "meeting"
  | "notifications"
  | "personAdd"
  | "personSearch"
  | "phoneCallback"
  | "search"
  | "settings"
  | "task"
  | "truck"
  | "warning"
  | "web"
  | "check"
  | "delete";

type AdminIconProps = SVGProps<SVGSVGElement> & {
  name: AdminIconName;
};

export function AdminIcon({ name, ...props }: AdminIconProps) {
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

  const paths: Record<AdminIconName, ReactNode> = {
    add: <path {...common} d="M12 5v14M5 12h14" />,
    check: <path {...common} d="m5 12 5 5 9-10" />,
    delete: (
      <>
        <path {...common} d="M5 7h14" />
        <path {...common} d="M9 7V5h6v2" />
        <path {...common} d="M7 7l1 12h8l1-12" />
        <path {...common} d="M10 11v5M14 11v5" />
      </>
    ),
    article: (
      <>
        <rect {...common} x="4" y="4" width="16" height="16" rx="2" />
        <path {...common} d="M8 9h8M8 13h8M8 17h5" />
      </>
    ),
    chevronLeft: <path {...common} d="m14 7-5 5 5 5" />,
    download: (
      <>
        <path {...common} d="M12 4v10" />
        <path {...common} d="m8 11 4 4 4-4" />
        <path {...common} d="M5 19h14" />
      </>
    ),
    edit: (
      <>
        <path {...common} d="M14 6l4 4L8 20H4v-4z" />
        <path {...common} d="m13 7 4 4" />
      </>
    ),
    expandMore: <path {...common} d="m7 10 5 5 5-5" />,
    filter: (
      <>
        <path {...common} d="M4 7h10M18 7h2" />
        <circle {...common} cx="16" cy="7" r="2" />
        <path {...common} d="M4 17h2M10 17h10" />
        <circle {...common} cx="8" cy="17" r="2" />
      </>
    ),
    moreVert: (
      <>
        <circle {...filled} cx="12" cy="5.5" r="1.4" />
        <circle {...filled} cx="12" cy="12" r="1.4" />
        <circle {...filled} cx="12" cy="18.5" r="1.4" />
      </>
    ),
    openInNew: (
      <>
        <path {...common} d="M14 4h6v6" />
        <path {...common} d="M20 4 11 13" />
        <path
          {...common}
          d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"
        />
      </>
    ),
    logout: (
      <>
        <path {...common} d="M15 17l5-5-5-5" />
        <path {...common} d="M20 12H9" />
        <path {...common} d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
      </>
    ),
    addTask: (
      <>
        <path {...common} d="m5 12 4 4L19 6" />
        <path {...common} d="M4 20h9" />
        <path {...common} d="M17 14v6M14 17h6" />
      </>
    ),
    analytics: (
      <>
        <path {...common} d="M4 19V5" />
        <path {...common} d="M4 19h16" />
        <path {...common} d="M8 15v-4" />
        <path {...common} d="M12 15V8" />
        <path {...common} d="M16 15v-6" />
      </>
    ),
    architecture: (
      <>
        <path {...common} d="M4 20h16" />
        <path {...common} d="M7 20V9.5L12 4l5 5.5V20" />
        <path {...common} d="M9.5 20v-5h5v5" />
        <path {...common} d="M9 11h6" />
      </>
    ),
    arrowForward: <path {...common} d="M5 12h14m-6-6 6 6-6 6" />,
    call: (
      <>
        <path {...common} d="M7 5 5.5 6.5c-.8.8-.7 2.6.2 4.7.9 2.2 2.7 4.5 4.9 6.1 2.1 1.6 4.3 2 5.2 1.1L17.5 17l-3.1-3-1.4 1.3c-1.7-.8-3.4-2.5-4.2-4.2l1.3-1.4L7 5Z" />
      </>
    ),
    chevronRight: <path {...common} d="m9 6 6 6-6 6" />,
    construction: (
      <>
        <path {...common} d="M4 16h3l2-5h6l2 5h3" />
        <circle {...common} cx="8" cy="18" r="2" />
        <circle {...common} cx="16" cy="18" r="2" />
        <path {...common} d="M9 11V7h6v4" />
      </>
    ),
    dashboard: (
      <>
        <rect {...common} x="4" y="4" width="7" height="7" rx="1" />
        <rect {...common} x="13" y="4" width="7" height="5" rx="1" />
        <rect {...common} x="13" y="11" width="7" height="9" rx="1" />
        <rect {...common} x="4" y="13" width="7" height="7" rx="1" />
      </>
    ),
    engineering: (
      <>
        <circle {...common} cx="12" cy="8" r="3" />
        <path {...common} d="M5 20a7 7 0 0 1 14 0" />
        <path {...common} d="M7 8h10" />
        <path {...common} d="M9 5.5 8 8m7-2.5L16 8" />
      </>
    ),
    event: (
      <>
        <rect {...common} x="4" y="5" width="16" height="15" rx="2" />
        <path {...common} d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
    eventAvailable: (
      <>
        <rect {...common} x="4" y="5" width="16" height="15" rx="2" />
        <path {...common} d="M8 3v4M16 3v4M4 10h16" />
        <path {...common} d="m8 15 2.2 2.2L16 12" />
      </>
    ),
    eventNote: (
      <>
        <rect {...common} x="4" y="5" width="16" height="15" rx="2" />
        <path {...common} d="M8 3v4M16 3v4M4 10h16M8 14h8M8 17h5" />
      </>
    ),
    help: (
      <>
        <circle {...common} cx="12" cy="12" r="9" />
        <path {...common} d="M9.5 9a2.7 2.7 0 0 1 5.1 1.2c0 2.3-2.6 2.4-2.6 4.3" />
        <path {...filled} d="M12 18.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z" />
      </>
    ),
    history: (
      <>
        <path {...common} d="M4 7v5h5" />
        <path {...common} d="M5 12a7 7 0 1 0 2-5" />
        <path {...common} d="M12 8v5l3 2" />
      </>
    ),
    location: (
      <>
        <path {...common} d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z" />
        <circle {...common} cx="12" cy="10" r="2.5" />
      </>
    ),
    mail: (
      <>
        <rect {...common} x="3.5" y="5.5" width="17" height="13" rx="2" />
        <path {...common} d="m4.5 7 7.5 6 7.5-6" />
      </>
    ),
    meeting: (
      <>
        <rect {...common} x="5" y="4" width="14" height="16" rx="1.5" />
        <path {...common} d="M9 8h6M9 12h6M9 16h3" />
      </>
    ),
    notifications: (
      <>
        <path {...common} d="M18 10a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" />
        <path {...common} d="M10 19a2 2 0 0 0 4 0" />
      </>
    ),
    personAdd: (
      <>
        <circle {...common} cx="9" cy="8" r="3" />
        <path {...common} d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <path {...common} d="M18 8v6M15 11h6" />
      </>
    ),
    personSearch: (
      <>
        <circle {...common} cx="9" cy="8" r="3" />
        <path {...common} d="M3.5 19a5.5 5.5 0 0 1 9.2-4.1" />
        <circle {...common} cx="17" cy="16" r="3" />
        <path {...common} d="m19.2 18.2 2 2" />
      </>
    ),
    phoneCallback: (
      <>
        <path {...common} d="M15 5h5v5" />
        <path {...common} d="M20 5 14 11" />
        <path {...common} d="M7 5 5.5 6.5c-.8.8-.7 2.6.2 4.7.9 2.2 2.7 4.5 4.9 6.1 2.1 1.6 4.3 2 5.2 1.1L17.5 17l-3.1-3-1.4 1.3c-1.7-.8-3.4-2.5-4.2-4.2l1.3-1.4L7 5Z" />
      </>
    ),
    search: (
      <>
        <circle {...common} cx="10.5" cy="10.5" r="6" />
        <path {...common} d="m15 15 5 5" />
      </>
    ),
    settings: (
      <>
        <circle {...common} cx="12" cy="12" r="3" />
        <path {...common} d="M19 13.5a7.7 7.7 0 0 0 0-3l2-1.5-2-3.5-2.4 1a7.2 7.2 0 0 0-2.6-1.5L13.7 2h-3.4L10 5a7.2 7.2 0 0 0-2.6 1.5l-2.4-1-2 3.5 2 1.5a7.7 7.7 0 0 0 0 3l-2 1.5 2 3.5 2.4-1a7.2 7.2 0 0 0 2.6 1.5l.3 3h3.4l.3-3a7.2 7.2 0 0 0 2.6-1.5l2.4 1 2-3.5-2-1.5Z" />
      </>
    ),
    task: (
      <>
        <circle {...common} cx="12" cy="12" r="9" />
        <path {...common} d="m8 12.5 2.4 2.4L16.5 9" />
      </>
    ),
    truck: (
      <>
        <path {...common} d="M3 7h10v9H3z" />
        <path {...common} d="M13 10h4l4 4v2h-8" />
        <circle {...common} cx="7" cy="18" r="2" />
        <circle {...common} cx="17" cy="18" r="2" />
      </>
    ),
    warning: (
      <>
        <path {...common} d="M12 4 3 20h18L12 4Z" />
        <path {...common} d="M12 9v5" />
        <path {...filled} d="M12 18.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z" />
      </>
    ),
    web: (
      <>
        <rect {...common} x="4" y="5" width="16" height="14" rx="2" />
        <path {...common} d="M4 9h16M8 13h4M8 16h8" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      {paths[name]}
    </svg>
  );
}
