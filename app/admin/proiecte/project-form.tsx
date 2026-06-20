import type { FormState } from "@/app/actions/content";
import { PROJECT_STATUSES, PROJECT_TYPES, type Project } from "@/app/data/projects";
import { AdminFormFrame } from "../form-client";
import { ImageUploadField } from "../image-upload-field";
import {
  CheckboxField,
  FormGrid,
  SelectField,
  TextAreaField,
  TextField,
} from "../form-ui";

export function ProjectForm({
  action,
  project,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  project?: Project;
}) {
  return (
    <AdminFormFrame
      action={action}
      submitLabel={project ? "Salvează modificările" : "Creează proiectul"}
    >
      {project ? <input defaultValue={project.id} name="id" type="hidden" /> : null}

      <FormGrid>
        <TextField
          defaultValue={project?.code}
          label="Cod"
          name="code"
          placeholder="PRJ-2026-001"
          required
        />
        <TextField defaultValue={project?.name} label="Denumire" name="name" required />
        <TextField defaultValue={project?.client} label="Client" name="client" />
        <SelectField
          defaultValue={project?.type ?? PROJECT_TYPES[0]}
          label="Tip"
          name="type"
          options={PROJECT_TYPES.map((t) => ({ value: t, label: t }))}
          required
        />
        <SelectField
          defaultValue={project?.status ?? PROJECT_STATUSES[0]}
          label="Status"
          name="status"
          options={PROJECT_STATUSES.map((s) => ({ value: s, label: s }))}
          required
        />
        <TextField defaultValue={project?.location} label="Locație" name="location" />
        <TextField
          defaultValue={project?.value}
          label="Valoare"
          name="value"
          placeholder="82.500 €"
        />
        <TextField
          defaultValue={project?.deadline}
          label="Termen"
          name="deadline"
          placeholder="30 Iun 2026"
        />

        <div className="md:col-span-2 mt-2 border-t border-[#e6e1d7] pt-4">
          <p className="font-serif-display text-[11px] font-semibold uppercase tracking-wide text-[#6b706a]">
            Portofoliu public (/proiecte)
          </p>
        </div>
        <TextField
          defaultValue={project?.slug ?? ""}
          hint="Lasă gol pentru generare automată din denumire."
          label="Slug"
          name="slug"
        />
        <ImageUploadField
          defaultValue={project?.imageBeforeSrc ?? ""}
          folder="proiecte"
          hint="Opțional. Apare în galeria înainte/după pe pagina proiectului."
          label="Imagine ÎNAINTE"
          name="image_before_src"
        />
        <TextField
          defaultValue={project?.imageBeforeAlt ?? ""}
          label="Imagine ÎNAINTE (alt)"
          name="image_before_alt"
        />
        <ImageUploadField
          defaultValue={project?.imageSrc ?? ""}
          folder="proiecte"
          hint="Imaginea principală / „după”. Apare și ca thumbnail în listă."
          label="Imagine DUPĂ"
          name="image_src"
        />
        <TextField
          defaultValue={project?.imageAlt ?? ""}
          label="Imagine DUPĂ (alt)"
          name="image_alt"
        />
        <TextAreaField
          defaultValue={project?.summary ?? ""}
          hint="Descriere publică a lucrării (apare în portofoliu). Nu include date sensibile (client, valoare)."
          label="Rezumat public"
          name="summary"
          rows={3}
        />
        <div className="md:col-span-2">
          <CheckboxField
            defaultChecked={project?.isPublished ?? false}
            label="Publicat în portofoliul public (/proiecte)"
            name="is_published"
          />
        </div>
      </FormGrid>
    </AdminFormFrame>
  );
}
