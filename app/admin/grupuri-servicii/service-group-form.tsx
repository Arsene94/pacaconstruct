import type { FormState } from "@/app/actions/content";
import type { AdminServiceGroup } from "@/app/data/services";
import { AdminFormFrame } from "@/app/admin/form-client";
import { FieldHint, FormGrid, TextField } from "@/app/admin/form-ui";

const labelClass =
  "mb-1.5 block font-serif-display text-[11px] font-semibold uppercase tracking-wide text-[#6b706a]";

export function ServiceGroupForm({
  action,
  group,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  group?: AdminServiceGroup;
}) {
  return (
    <AdminFormFrame
      action={action}
      submitLabel={group ? "Salvează modificările" : "Creează grupul"}
    >
      {group ? <input defaultValue={group.id} name="id" type="hidden" /> : null}

      <FormGrid>
        <TextField
          defaultValue={group?.title}
          hint="Apare ca titlu de coloană în meniul „Servicii”."
          label="Titlu"
          name="title"
          required
        />

        {group ? (
          // Slug-ul e cheia stabilă referită de serviciile asignate; nu se mai
          // schimbă după creare (vezi updateServiceGroup).
          <label className="block">
            <span className={labelClass}>Slug</span>
            <p className="flex h-9 items-center rounded-[2px] border border-[#e6e1d7] bg-[#f1efe9] px-3 font-mono text-sm text-[#6b706a]">
              {group.slug}
            </p>
            <FieldHint>Fix după creare — serviciile sunt legate prin el.</FieldHint>
          </label>
        ) : (
          <TextField
            hint="Lasă gol pentru generare automată din titlu."
            label="Slug"
            name="slug"
          />
        )}

        <TextField
          defaultValue={group?.href}
          full
          hint="Pagina deschisă la click pe titlul grupului. Implicit: /servicii/<slug>."
          label="Link (href)"
          name="href"
          placeholder="/servicii/exemplu"
        />

        <TextField
          defaultValue={group?.sort_order ?? 0}
          hint="Ordinea coloanei în meniu (crescător)."
          label="Ordine"
          name="sort_order"
          type="number"
        />
      </FormGrid>
    </AdminFormFrame>
  );
}
