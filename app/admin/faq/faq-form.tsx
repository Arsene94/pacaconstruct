import type { FormState } from "@/app/actions/content";
import { AdminFormFrame } from "@/app/admin/form-client";
import {
  CheckboxField,
  FormGrid,
  SelectField,
  TextAreaField,
  TextField,
} from "@/app/admin/form-ui";
import type { AdminFaqItem } from "@/app/data/faq";

export function FaqItemForm({
  action,
  sections,
  item,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  sections: { value: string; label: string }[];
  item?: AdminFaqItem;
}) {
  return (
    <AdminFormFrame
      action={action}
      submitLabel={item ? "Salvează modificările" : "Creează întrebarea"}
    >
      {item ? <input defaultValue={item.id} name="id" type="hidden" /> : null}

      <FormGrid>
        <SelectField
          defaultValue={item?.section_id ?? ""}
          includeEmpty="— Alege categoria —"
          label="Categorie"
          name="section_id"
          options={sections}
          required
        />
        <TextField
          defaultValue={item?.sort_order ?? 0}
          label="Ordine"
          name="sort_order"
          type="number"
        />
        <TextField
          defaultValue={item?.question}
          full
          label="Întrebare"
          name="question"
          required
        />
        <TextAreaField
          defaultValue={item?.answer}
          label="Răspuns"
          name="answer"
          rows={4}
        />
        <TextAreaField
          defaultValue={(item?.highlights ?? []).join("\n")}
          label="Puncte cheie (unul pe linie)"
          name="highlights"
          rows={3}
        />
        <div className="md:col-span-2">
          <CheckboxField
            defaultChecked={item ? item.is_published : true}
            label="Publicat"
            name="is_published"
          />
        </div>
      </FormGrid>
    </AdminFormFrame>
  );
}
