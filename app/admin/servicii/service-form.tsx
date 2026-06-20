import type { FormState } from "@/app/actions/content";
import type { AdminService } from "@/app/data/services";
import { AdminFormFrame } from "@/app/admin/form-client";
import { ImageUploadField } from "@/app/admin/image-upload-field";
import {
  CheckboxField,
  FormGrid,
  SelectField,
  TextAreaField,
  TextField,
} from "@/app/admin/form-ui";

export function ServiceForm({
  action,
  groups,
  service,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  groups: { value: string; label: string }[];
  service?: AdminService;
}) {
  return (
    <AdminFormFrame
      action={action}
      submitLabel={service ? "Salvează modificările" : "Creează serviciul"}
    >
      {service ? <input defaultValue={service.id} name="id" type="hidden" /> : null}

      <FormGrid>
        <TextField defaultValue={service?.title} label="Titlu" name="title" required />
        <TextField
          defaultValue={service?.slug}
          hint="Lasă gol pentru generare automată din titlu."
          label="Slug"
          name="slug"
        />
        <TextField
          defaultValue={service?.short_title ?? ""}
          label="Titlu scurt"
          name="short_title"
        />
        <TextField defaultValue={service?.eyebrow} label="Eyebrow" name="eyebrow" />
        <SelectField
          defaultValue={service?.group_slug ?? ""}
          includeEmpty="— Fără grup (serviciu cap de grup) —"
          label="Grup meniu"
          name="group_slug"
          options={groups}
        />
        <TextField
          defaultValue={service?.sort_order ?? 0}
          label="Ordine"
          name="sort_order"
          type="number"
        />
        <ImageUploadField
          defaultValue={service?.image_src ?? ""}
          folder="servicii"
          label="Imagine"
          name="image_src"
        />
        <TextField
          defaultValue={service?.image_alt ?? ""}
          label="Imagine (alt)"
          name="image_alt"
        />
        <TextAreaField
          defaultValue={service?.description}
          label="Descriere"
          name="description"
          rows={3}
        />
        <TextField
          defaultValue={service?.summary_title}
          full
          label="Titlu sumar"
          name="summary_title"
        />
        <TextAreaField
          defaultValue={service?.summary}
          label="Sumar"
          name="summary"
          rows={3}
        />
        <TextAreaField
          defaultValue={(service?.processes ?? [])
            .map((p) => `${p.title} :: ${p.text}`)
            .join("\n")}
          hint="Format pe linie: Titlu :: Text"
          label="Procese (un proces pe linie: Titlu :: Text)"
          name="processes"
          rows={5}
        />
        <TextAreaField
          defaultValue={(service?.specs ?? [])
            .map((s) => `${s.label} :: ${s.value} :: ${s.impact}`)
            .join("\n")}
          hint="Format pe linie: Etichetă :: Valoare :: Impact"
          label="Specificații (pe linie: Etichetă :: Valoare :: Impact)"
          name="specs"
          rows={5}
        />
        <TextAreaField
          defaultValue={(service?.faqs ?? [])
            .map((f) => `${f.question} :: ${f.answer}`)
            .join("\n")}
          hint="Format pe linie: Întrebare :: Răspuns. Apar pe pagina serviciului și în schema FAQPage (SEO). Lasă gol pentru întrebări generate automat."
          label="Întrebări frecvente (pe linie: Întrebare :: Răspuns)"
          name="faqs"
          rows={5}
        />

        <div className="flex flex-wrap gap-5 md:col-span-2">
          <CheckboxField
            defaultChecked={service ? service.is_published : true}
            label="Publicat"
            name="is_published"
          />
          <CheckboxField
            defaultChecked={service?.in_mosaic ?? false}
            label="Apare în mozaic homepage"
            name="in_mosaic"
          />
          <CheckboxField
            defaultChecked={service?.is_mosaic_hero ?? false}
            label="Card mare (mozaic)"
            name="is_mosaic_hero"
          />
          <CheckboxField
            defaultChecked={service?.is_mosaic_wide ?? false}
            label="Card lat (mozaic)"
            name="is_mosaic_wide"
          />
        </div>
      </FormGrid>
    </AdminFormFrame>
  );
}
