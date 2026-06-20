import { createClient } from "@/app/lib/supabase/server";

export type RequestStatus =
  | "Nouă"
  | "În evaluare"
  | "Ofertat"
  | "Confirmat"
  | "Închisă";

export type RequestChannel = "Formular" | "Telefon" | "Email";

export const REQUEST_STATUSES: RequestStatus[] = [
  "Nouă",
  "În evaluare",
  "Ofertat",
  "Confirmat",
  "Închisă",
];

export type ServiceRequest = {
  id: string;
  code: string;
  name: string;
  contact: string;
  service: string | null;
  location: string | null;
  surface: string | null;
  description: string | null;
  channel: RequestChannel;
  status: RequestStatus;
  date: string;
};

export type RentalRequest = {
  id: string;
  code: string;
  name: string;
  contact: string;
  machine: string;
  period: string | null;
  location: string | null;
  message: string | null;
  status: RequestStatus;
  date: string;
};

/** Format „19 Iun 2026, 09:30" pentru afișaj în panou. */
const dateFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(iso: string): string {
  const formatted = dateFormatter.format(new Date(iso));
  // Capitalizează luna (ro-RO redă „iun." cu literă mică).
  return formatted.replace(/(\d{2}) (\p{L})/u, (_, day, first) => `${day} ${first.toUpperCase()}`);
}

type ServiceRequestRow = {
  id: string;
  code: string;
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  location: string | null;
  surface: string | null;
  description: string | null;
  channel: RequestChannel;
  status: RequestStatus;
  created_at: string;
};

type RentalRequestRow = {
  id: string;
  code: string;
  name: string;
  phone: string | null;
  email: string | null;
  machine: string;
  period: string | null;
  location: string | null;
  message: string | null;
  status: RequestStatus;
  created_at: string;
};

/** Cererile de servicii primite (intake din formularul de contact). */
export async function getServiceRequests(): Promise<ServiceRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select(
      "id, code, name, phone, email, service, location, surface, description, channel, status, created_at",
    )
    .order("created_at", { ascending: false })
    .returns<ServiceRequestRow[]>();

  if (error) {
    throw new Error(`Nu am putut încărca cererile de servicii: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    contact: row.phone ?? row.email ?? "—",
    service: row.service,
    location: row.location,
    surface: row.surface,
    description: row.description,
    channel: row.channel,
    status: row.status,
    date: formatDate(row.created_at),
  }));
}

/** Cererile de închiriere primite (intake din paginile de utilaje). */
export async function getRentalRequests(): Promise<RentalRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rental_requests")
    .select(
      "id, code, name, phone, email, machine, period, location, message, status, created_at",
    )
    .order("created_at", { ascending: false })
    .returns<RentalRequestRow[]>();

  if (error) {
    throw new Error(`Nu am putut încărca cererile de închiriere: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    contact: row.phone ?? row.email ?? "—",
    machine: row.machine,
    period: row.period,
    location: row.location,
    message: row.message,
    status: row.status,
    date: formatDate(row.created_at),
  }));
}
