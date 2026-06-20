import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminIcon, type AdminIconName } from "./admin-icons";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Admin Dashboard | PACA CONSTRUCT",
  description: "Panou operațional intern pentru administrarea solicitărilor PACA CONSTRUCT.",
};

const alerts = [
  {
    tone: "error",
    text: "3 solicitări noi neatribuite de peste 24h",
    action: "Atribuie acum",
  },
  {
    tone: "warning",
    text: "Excavator CAT320 necesită mentenanță urgentă",
    action: "Deschide tichet",
  },
];

const kpis: Array<{
  label: string;
  value: string;
  icon: AdminIconName;
  tone: "amber" | "error" | "forest" | "success";
}> = [
  { label: "Solicitări noi", value: "12", icon: "mail", tone: "amber" },
  { label: "De contactat", value: "5", icon: "phoneCallback", tone: "error" },
  { label: "Evaluări programate", value: "8", icon: "eventAvailable", tone: "forest" },
  { label: "Proiecte active", value: "24", icon: "construction", tone: "success" },
];

const enquiries: Array<{
  requester: string;
  date: string;
  type: "Proiect" | "Închiriere";
  service: string;
  status: string;
  statusTone: "error" | "sage" | "muted";
  owner: string;
  ownerInitial?: string;
  ownerTone?: "forest" | "amber";
  actions: Array<{ label: string; icon: AdminIconName; highlight?: boolean }>;
}> = [
  {
    requester: "Popescu Ion",
    date: "Azi, 09:30",
    type: "Proiect",
    service: "Excavare fundație casă P+1",
    status: "Nouă",
    statusTone: "error",
    owner: "- Neatribuit -",
    actions: [
      { label: "Atribuie", icon: "personAdd" },
      { label: "Sună", icon: "call" },
    ],
  },
  {
    requester: "SC Construct SRL",
    date: "Ieri, 14:15",
    type: "Închiriere",
    service: "Buldoexcavator (3 zile)",
    status: "Ofertat",
    statusTone: "sage",
    owner: "Mihai C.",
    ownerInitial: "M",
    ownerTone: "forest",
    actions: [
      { label: "Transformă în comandă", icon: "addTask", highlight: true },
      { label: "Email", icon: "mail" },
    ],
  },
  {
    requester: "Ionescu Maria",
    date: "22 Oct, 10:00",
    type: "Proiect",
    service: "Nivelare teren (aprox. 500mp)",
    status: "Programat Ev.",
    statusTone: "muted",
    owner: "Andrei P.",
    ownerInitial: "A",
    ownerTone: "amber",
    actions: [{ label: "Editează programare", icon: "eventNote" }],
  },
];

const tasks = [
  {
    title: "Trimite contract actualizat pt. Lot 4",
    contact: "Nord Development",
    due: "Azi, 14:00",
    tone: "error",
  },
  {
    title: "Follow-up ofertă demolare hală",
    contact: "SC Construct SRL",
    due: "Mâine",
    tone: "warning",
  },
];

const machineryStatus = [
  { label: "Disponibile în bază", value: "14", tone: "success" },
  { label: "Pe șantier / Închiriate", value: "8", tone: "warning" },
  { label: "În mentenanță", value: "2", tone: "error" },
];

const websiteStatus = [
  { label: "Pagina Servicii", value: "Actualizat", tone: "success" },
  { label: "Articole Blog", value: "1 Draft", tone: "warning" },
  { label: "FAQ & Contact", value: "Verificat", tone: "success" },
];

const schedule = [
  {
    time: "10:00",
    title: "Evaluare teren Lot 4",
    icon: "location" as const,
    meta: "Str. Primăverii",
  },
  {
    time: "13:30",
    title: "Întâlnire subcontractori",
    icon: "meeting" as const,
    meta: "Birou central",
  },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatAdminDate(date: Date) {
  const formatter = new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  });
  const value = formatter.format(date);

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function iconToneClass(tone: "amber" | "error" | "forest" | "success") {
  return {
    amber: "text-[#d88a24]",
    error: "text-[#b91c1c]",
    forest: "text-[#58683c]",
    success: "text-[#15803d]",
  }[tone];
}

function statusClass(tone: "error" | "sage" | "muted") {
  return {
    error: "bg-[#ffdad6] text-[#93000a]",
    sage: "bg-[#d4eca1] text-[#586b2f]",
    muted: "bg-[#e4e2dc] text-[#434843]",
  }[tone];
}

function smallBadgeClass(tone: string) {
  if (tone === "success") {
    return "bg-[#15803d]/10 text-[#15803d]";
  }
  if (tone === "error") {
    return "bg-[#b91c1c]/10 text-[#b91c1c]";
  }
  return "bg-[#d88a24]/10 text-[#d88a24]";
}

function KpiCard({
  icon,
  label,
  tone,
  value,
}: {
  icon: AdminIconName;
  label: string;
  tone: "amber" | "error" | "forest" | "success";
  value: string;
}) {
  return (
    <article className="flex items-center justify-between rounded-[2px] border border-[#e6e1d7] bg-white p-4 shadow-sm">
      <div>
        <h3 className="mb-1 font-serif-display text-xs font-semibold uppercase leading-4 text-[#6b706a]">
          {label}
        </h3>
        <p
          className={cx(
            "text-2xl font-semibold leading-none",
            tone === "error" ? "text-[#b91c1c]" : "text-[#171a16]",
          )}
        >
          {value}
        </p>
      </div>
      <AdminIcon className={cx("h-6 w-6", iconToneClass(tone))} name={icon} />
    </article>
  );
}

function PanelHeader({
  action,
  icon,
  title,
}: {
  action?: ReactNode;
  icon?: AdminIconName;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#e6e1d7] bg-[#fbf9f3]/70 p-4">
      <div className="flex items-center gap-2">
        {icon ? <AdminIcon className="h-5 w-5 text-[#171a16]" name={icon} /> : null}
        <h3 className="text-sm font-bold uppercase leading-5 text-[#171a16]">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function OwnerLabel({
  initial,
  name,
  tone,
}: {
  initial?: string;
  name: string;
  tone?: "forest" | "amber";
}) {
  if (!initial) {
    return <span className="text-[11px] text-[#6b706a]">{name}</span>;
  }

  return (
    <span className="flex items-center gap-1 text-[11px] text-[#171a16]">
      <span
        className={cx(
          "flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white",
          tone === "amber" ? "bg-[#d88a24]" : "bg-[#58683c]",
        )}
      >
        {initial}
      </span>
      {name}
    </span>
  );
}

function EnquiryType({ type }: { type: "Proiect" | "Închiriere" }) {
  const isRental = type === "Închiriere";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 font-semibold",
        isRental ? "text-[#d88a24]" : "text-[#58683c]",
      )}
    >
      <AdminIcon className="h-3.5 w-3.5" name={isRental ? "truck" : "architecture"} />
      {type}
    </span>
  );
}

export default function AdminDashboardPage() {
  const currentDate = formatAdminDate(new Date());

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <section className="border-y border-r border-l-4 border-y-[#e6e1d7] border-r-[#e6e1d7] border-l-[#b91c1c] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <AdminIcon className="h-5 w-5 text-[#b91c1c]" name="warning" />
            <h2 className="text-sm font-bold uppercase leading-5 text-[#171a16]">
              Necesită atenție imediată
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {alerts.map((alert) => (
              <div
                className="flex items-center justify-between gap-3 rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] p-3"
                key={alert.text}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cx(
                      "h-2 w-2 shrink-0 rounded-full",
                      alert.tone === "error" ? "bg-[#b91c1c]" : "bg-[#d88a24]",
                    )}
                  />
                  <span className="text-xs font-medium leading-4 text-[#171a16]">
                    {alert.text}
                  </span>
                </div>
                <button
                  className="shrink-0 text-xs font-semibold leading-4 text-[#58683c] hover:underline"
                  type="button"
                >
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold leading-8 text-[#171a16]">
              Bun venit, Admin
            </h1>
            <p className="mt-0.5 text-xs font-medium leading-4 text-[#6b706a]">
              {currentDate}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="flex h-9 items-center justify-center gap-2 rounded-[2px] border border-[#e6e1d7] bg-white px-4 text-xs font-medium leading-4 text-[#171a16] shadow-sm transition-colors hover:bg-[#fbf9f3]"
              type="button"
            >
              <AdminIcon className="h-4.5 w-4.5" name="add" />
              Proiect Nou
            </button>
            <button
              className="flex h-9 items-center justify-center gap-2 rounded-[2px] bg-[#d88a24] px-4 text-xs font-medium leading-4 text-white shadow-sm transition-colors hover:bg-[#c27a1f]"
              type="button"
            >
              <AdminIcon className="h-4.5 w-4.5" name="add" />
              Solicitare Nouă
            </button>
          </div>
        </div>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="flex flex-col rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
              <PanelHeader
                action={
                  <button
                    className="flex items-center gap-1 text-xs font-semibold leading-4 text-[#58683c] hover:underline"
                    type="button"
                  >
                    Vezi toate
                    <AdminIcon className="h-4 w-4" name="arrowForward" />
                  </button>
                }
                title="Solicitări Recente"
              />
              <div className={cx(styles.tableScroll, "overflow-x-auto")}>
                <table className="w-full border-collapse text-left text-xs font-medium leading-4">
                  <thead>
                    <tr className="border-b border-[#e6e1d7] bg-white">
                      <th className="w-1/5 whitespace-nowrap px-4 py-3 font-serif-display text-xs font-semibold uppercase text-[#6b706a]">
                        Solicitant
                      </th>
                      <th className="w-1/5 whitespace-nowrap px-4 py-3 font-serif-display text-xs font-semibold uppercase text-[#6b706a]">
                        Tip Cerere
                      </th>
                      <th className="w-1/4 whitespace-nowrap px-4 py-3 font-serif-display text-xs font-semibold uppercase text-[#6b706a]">
                        Detaliu Serviciu
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 font-serif-display text-xs font-semibold uppercase text-[#6b706a]">
                        Status / Responsabil
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-right font-serif-display text-xs font-semibold uppercase text-[#6b706a]">
                        Acțiuni
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enquiry) => (
                      <tr
                        className="border-b border-[#e6e1d7] transition-colors last:border-b-0 hover:bg-[#fbf9f3]/60"
                        key={`${enquiry.requester}-${enquiry.date}`}
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="font-bold text-[#171a16]">
                            {enquiry.requester}
                          </div>
                          <div className="mt-0.5 text-[11px] text-[#6b706a]">
                            {enquiry.date}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <EnquiryType type={enquiry.type} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-[#171a16]">
                          {enquiry.service}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={cx(
                                "inline-flex items-center rounded-[2px] px-1.5 py-0.5 text-[11px] font-bold",
                                statusClass(enquiry.statusTone),
                              )}
                            >
                              {enquiry.status}
                            </span>
                            <OwnerLabel
                              initial={enquiry.ownerInitial}
                              name={enquiry.owner}
                              tone={enquiry.ownerTone}
                            />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            {enquiry.actions.map((action) => (
                              <button
                                aria-label={action.label}
                                className={cx(
                                  "rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] p-1 text-[#6b706a] transition-colors hover:text-[#171a16]",
                                  action.highlight && "hover:text-[#58683c]",
                                )}
                                key={action.label}
                                type="button"
                              >
                                <AdminIcon className="h-4 w-4" name={action.icon} />
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
              <PanelHeader
                action={
                  <button
                    aria-label="Adaugă sarcină"
                    className="text-[#6b706a] hover:text-[#171a16]"
                    type="button"
                  >
                    <AdminIcon className="h-4.5 w-4.5" name="add" />
                  </button>
                }
                icon="task"
                title="Sarcini & Follow-up"
              />
              <div className="divide-y divide-[#e6e1d7]">
                {tasks.map((task) => (
                  <div
                    className="flex items-start gap-3 p-3 transition-colors hover:bg-[#fbf9f3]/70"
                    key={task.title}
                  >
                    <input
                      className="mt-1 h-4 w-4 rounded-[2px] border-[#e6e1d7] accent-[#58683c]"
                      type="checkbox"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-semibold leading-4 text-[#171a16]">
                        {task.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#6b706a]">
                        Către: {task.contact}
                      </p>
                    </div>
                    <span
                      className={cx(
                        "rounded-[2px] px-2 py-0.5 text-[11px] font-bold",
                        smallBadgeClass(task.tone),
                      )}
                    >
                      {task.due}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
              <PanelHeader icon="construction" title="Situație Utilaje" />
              <div className="space-y-2 p-3">
                {machineryStatus.map((item) => (
                  <div
                    className={cx(
                      "flex items-center justify-between rounded-[2px] border p-2",
                      item.tone === "error"
                        ? "border-[#b91c1c]/20 bg-[#ffdad6]/30"
                        : "border-[#e6e1d7]/50 bg-[#fbf9f3]",
                    )}
                    key={item.label}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cx(
                          "h-2.5 w-2.5 rounded-[2px]",
                          item.tone === "success" && "bg-[#15803d]",
                          item.tone === "warning" && "bg-[#d88a24]",
                          item.tone === "error" && "bg-[#b91c1c]",
                        )}
                      />
                      <span className="text-xs font-medium leading-4 text-[#171a16]">
                        {item.label}
                      </span>
                    </div>
                    <span
                      className={cx(
                        "text-sm font-bold leading-5",
                        item.tone === "error" ? "text-[#b91c1c]" : "text-[#171a16]",
                      )}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
                <button
                  className="mt-2 w-full pt-1 text-[11px] font-bold uppercase text-[#6b706a] hover:text-[#171a16]"
                  type="button"
                >
                  Vezi parcul auto
                </button>
              </div>
            </section>

            <section className="rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
              <PanelHeader icon="web" title="Status Website" />
              <div className="space-y-3 p-3">
                {websiteStatus.map((item) => (
                  <div className="flex items-center justify-between gap-3" key={item.label}>
                    <span className="text-xs leading-4 text-[#6b706a]">{item.label}</span>
                    <span
                      className={cx(
                        "rounded-[2px] px-2 py-0.5 text-[11px] font-bold",
                        smallBadgeClass(item.tone),
                      )}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
                <button
                  className="mt-1 w-full rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] py-1.5 text-[11px] font-bold text-[#171a16] transition-colors hover:bg-[#e6e1d7]/50"
                  type="button"
                >
                  Administrare CMS
                </button>
              </div>
            </section>

            <section className="rounded-[2px] border border-[#e6e1d7] bg-white shadow-sm">
              <PanelHeader
                action={
                  <span className="rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] px-1.5 py-0.5 text-[11px] font-bold">
                    2
                  </span>
                }
                icon="event"
                title="Programări Azi"
              />
              <div className="divide-y divide-[#e6e1d7]">
                {schedule.map((item) => (
                  <div
                    className="flex items-stretch transition-colors hover:bg-[#fbf9f3]/70"
                    key={item.time}
                  >
                    <div className="flex w-14 flex-col items-center justify-center border-r border-[#e6e1d7] bg-[#fbf9f3]/70 py-2">
                      <span className="text-xs font-bold leading-4 text-[#171a16]">
                        {item.time}
                      </span>
                    </div>
                    <div className="flex-1 p-2.5">
                      <h4 className="text-xs font-bold leading-4 text-[#171a16]">
                        {item.title}
                      </h4>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#6b706a]">
                        <AdminIcon className="h-3 w-3" name={item.icon} />
                        {item.meta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}
