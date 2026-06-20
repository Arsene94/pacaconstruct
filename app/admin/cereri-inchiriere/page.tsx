import type { Metadata } from "next";
import {
  deleteRentalRequest,
  updateRentalRequestStatus,
} from "@/app/actions/content";
import { getRentalRequests, REQUEST_STATUSES } from "@/app/data/requests";
import { DeleteButton, StatusSelect } from "@/app/admin/form-client";
import {
  AdminContent,
  FilterSelect,
  IconButton,
  PageHeader,
  SearchField,
  SecondaryButton,
  TableCard,
  TableFooter,
  Th,
  Toolbar,
} from "../admin-ui";

export const metadata: Metadata = {
  title: "Cereri închiriere | Admin PACA CONSTRUCT",
  description: "Solicitările de închiriere utilaje primite prin site, telefon și email.",
};

export default async function AdminCereriInchirierePage() {
  const requests = await getRentalRequests();
  const newCount = requests.filter((request) => request.status === "Nouă").length;

  return (
    <AdminContent>
      <PageHeader
        title="Cereri închiriere"
        description={`${requests.length} solicitări · ${newCount} noi`}
        actions={<SecondaryButton icon="download">Export</SecondaryButton>}
      />

      <Toolbar>
        <SearchField placeholder="Caută după solicitant, cod sau utilaj..." />
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            label="Utilaj"
            options={[
              "Toate",
              "Excavator cu operator",
              "Buldoexcavator",
              "Încărcător frontal",
              "Transport agregate",
              "Transport pământ",
            ]}
          />
          <FilterSelect
            label="Status"
            options={["Toate", "Nouă", "În evaluare", "Ofertat", "Confirmat", "Închisă"]}
          />
        </div>
      </Toolbar>

      <TableCard
        minWidth={1040}
        footer={<TableFooter shown={requests.length} total={requests.length} noun="cereri" />}
      >
        <thead>
          <tr>
            <Th>Cod</Th>
            <Th>Solicitant</Th>
            <Th className="w-1/5">Utilaj</Th>
            <Th>Perioadă</Th>
            <Th>Locație</Th>
            <Th>Data</Th>
            <Th>Status</Th>
            <Th className="text-right">Acțiuni</Th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              className="border-b border-[#e6e1d7] transition-colors last:border-b-0 hover:bg-[#fbf9f3]/60"
              key={request.id}
            >
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-[#6b706a]">
                {request.code}
              </td>
              <td className="px-4 py-3">
                <div className="font-bold text-[#171a16]">{request.name}</div>
                <div className="mt-0.5 text-[11px] text-[#6b706a]">
                  {request.contact}
                </div>
              </td>
              <td className="px-4 py-3 text-[#171a16]">{request.machine}</td>
              <td className="whitespace-nowrap px-4 py-3 text-[#6b706a]">
                {request.period ?? "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-[#6b706a]">
                {request.location ?? "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-[#6b706a]">
                {request.date}
              </td>
              <td className="px-4 py-3">
                <StatusSelect
                  action={updateRentalRequestStatus}
                  id={request.id}
                  value={request.status}
                  options={REQUEST_STATUSES}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <IconButton icon="call" label="Sună" />
                  <IconButton icon="mail" label="Email" />
                  <DeleteButton action={deleteRentalRequest} id={request.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </TableCard>
    </AdminContent>
  );
}
