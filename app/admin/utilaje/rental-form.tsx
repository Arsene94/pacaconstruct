import type { FormState } from "@/app/actions/content";
import type { AdminRental } from "@/app/data/rentals";
import { AdminFormFrame } from "@/app/admin/form-client";
import {
  CheckboxField,
  FormGrid,
  TextAreaField,
  TextField,
} from "@/app/admin/form-ui";

export function RentalForm({
  action,
  machine,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  machine?: AdminRental;
}) {
  return (
    <AdminFormFrame
      action={action}
      submitLabel={machine ? "Salvează modificările" : "Creează utilajul"}
    >
      {machine ? <input defaultValue={machine.id} name="id" type="hidden" /> : null}

      <FormGrid>
        <TextField
          defaultValue={machine?.title}
          label="Titlu"
          name="title"
          required
        />
        <TextField
          defaultValue={machine?.slug}
          hint="Lasă gol pentru generare din titlu."
          label="Slug"
          name="slug"
        />
        <TextField
          defaultValue={machine?.category}
          label="Categorie"
          name="category"
        />
        <TextField
          defaultValue={machine?.price}
          label="Tarif"
          name="price"
          placeholder="De la 180 RON / ora"
        />
        <TextField
          defaultValue={machine?.sort_order ?? 0}
          label="Ordine"
          name="sort_order"
          type="number"
        />
        <TextField
          defaultValue={machine?.image_src ?? ""}
          label="Imagine (src)"
          name="image_src"
        />
        <TextField
          defaultValue={machine?.image_alt ?? ""}
          label="Imagine (alt)"
          name="image_alt"
        />
        <TextAreaField
          defaultValue={machine?.short_description}
          label="Descriere scurtă"
          name="short_description"
          rows={2}
        />
        <TextAreaField
          defaultValue={machine?.long_description}
          label="Descriere lungă"
          name="long_description"
          rows={3}
        />
        <TextAreaField
          defaultValue={(machine?.specs ?? [])
            .map((s) => `${s.label} :: ${s.value}`)
            .join("\n")}
          hint="Format pe linie: Etichetă :: Valoare"
          label="Specificații (pe linie: Etichetă :: Valoare)"
          name="specs"
          rows={5}
        />
        <TextAreaField
          defaultValue={(machine?.uses ?? []).join("\n")}
          label="Lucrări potrivite (una pe linie)"
          name="uses"
          rows={4}
        />
        <TextAreaField
          defaultValue={(machine?.access_requirements ?? []).join("\n")}
          label="Cerințe de acces (una pe linie)"
          name="access_requirements"
          rows={4}
        />

        <div className="flex flex-wrap gap-5 md:col-span-2">
          <CheckboxField
            defaultChecked={machine ? machine.is_published : true}
            label="Publicat"
            name="is_published"
          />
          <CheckboxField
            defaultChecked={machine ? machine.is_available : true}
            label="Disponibil"
            name="is_available"
          />
        </div>
      </FormGrid>
    </AdminFormFrame>
  );
}
