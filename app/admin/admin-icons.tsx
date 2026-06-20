import {
  IconAlertTriangle,
  IconArrowRight,
  IconArticle,
  IconBarrierBlock,
  IconBell,
  IconBuildingArch,
  IconCalendar,
  IconCalendarCheck,
  IconCalendarEvent,
  IconChartBar,
  IconCheck,
  IconChecklist,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheck,
  IconDotsVertical,
  IconDownload,
  IconExternalLink,
  IconFilter,
  IconHelmet,
  IconHelp,
  IconHistory,
  IconLayoutDashboard,
  IconLogout,
  IconMail,
  IconMapPin,
  IconPencil,
  IconPhone,
  IconPhoneCall,
  IconPlus,
  IconSearch,
  IconSettings,
  IconTrash,
  IconTruck,
  IconUserPlus,
  IconUsers,
  IconUserSearch,
  IconWorld,
  type Icon as TablerIcon,
  type IconProps,
} from "@tabler/icons-react";

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

const icons: Record<AdminIconName, TablerIcon> = {
  add: IconPlus,
  article: IconArticle,
  chevronLeft: IconChevronLeft,
  download: IconDownload,
  edit: IconPencil,
  expandMore: IconChevronDown,
  filter: IconFilter,
  moreVert: IconDotsVertical,
  openInNew: IconExternalLink,
  addTask: IconChecklist,
  analytics: IconChartBar,
  architecture: IconBuildingArch,
  arrowForward: IconArrowRight,
  call: IconPhone,
  chevronRight: IconChevronRight,
  construction: IconBarrierBlock,
  dashboard: IconLayoutDashboard,
  engineering: IconHelmet,
  event: IconCalendar,
  eventAvailable: IconCalendarCheck,
  eventNote: IconCalendarEvent,
  help: IconHelp,
  history: IconHistory,
  location: IconMapPin,
  logout: IconLogout,
  mail: IconMail,
  meeting: IconUsers,
  notifications: IconBell,
  personAdd: IconUserPlus,
  personSearch: IconUserSearch,
  phoneCallback: IconPhoneCall,
  search: IconSearch,
  settings: IconSettings,
  task: IconCircleCheck,
  truck: IconTruck,
  warning: IconAlertTriangle,
  web: IconWorld,
  check: IconCheck,
  delete: IconTrash,
};

type AdminIconProps = IconProps & {
  name: AdminIconName;
};

export function AdminIcon({ name, ...props }: AdminIconProps) {
  const TablerComp = icons[name];
  return <TablerComp aria-hidden="true" {...props} />;
}
