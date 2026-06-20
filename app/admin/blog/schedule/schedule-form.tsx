import type { FormState } from "@/app/actions/content";
import {
  CheckboxField,
  FormGrid,
  SelectField,
  TextField,
} from "@/app/admin/form-ui";
import { AdminFormFrame } from "@/app/admin/form-client";
import type { BlogSchedule } from "@/app/data/blog-ai";

const FREQUENCY_OPTIONS = [
  { value: "zilnic", label: "Zilnic" },
  { value: "saptamanal", label: "Săptămânal" },
  { value: "lunar", label: "Lunar" },
];

const DOW_OPTIONS = [
  { value: "1", label: "Luni" },
  { value: "2", label: "Marți" },
  { value: "3", label: "Miercuri" },
  { value: "4", label: "Joi" },
  { value: "5", label: "Vineri" },
  { value: "6", label: "Sâmbătă" },
  { value: "0", label: "Duminică" },
];

export function ScheduleForm({
  action,
  schedule,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  schedule?: BlogSchedule;
}) {
  return (
    <AdminFormFrame
      action={action}
      submitLabel={schedule ? "Salvează modificările" : "Creează programarea"}
    >
      {schedule ? (
        <input name="id" type="hidden" defaultValue={schedule.id} />
      ) : null}
      <FormGrid>
        <TextField
          name="name"
          label="Nume"
          defaultValue={schedule?.name}
          placeholder="ex. Articol săptămânal"
          full
        />
        <SelectField
          name="frequency"
          label="Frecvență"
          options={FREQUENCY_OPTIONS}
          defaultValue={schedule?.frequency ?? "saptamanal"}
          required
        />
        <TextField
          name="hour"
          label="Ora (0-23)"
          type="number"
          defaultValue={schedule?.hour ?? 9}
        />
        <SelectField
          name="day_of_week"
          label="Ziua săptămânii (pt. săptămânal)"
          options={DOW_OPTIONS}
          defaultValue={
            schedule?.day_of_week != null ? String(schedule.day_of_week) : "1"
          }
        />
        <TextField
          name="day_of_month"
          label="Ziua lunii (pt. lunar, 1-28)"
          type="number"
          defaultValue={schedule?.day_of_month ?? 1}
        />
        <TextField
          name="posts_per_run"
          label="Articole per rulare"
          type="number"
          defaultValue={schedule?.posts_per_run ?? 1}
        />
        <div className="flex flex-wrap gap-5 md:col-span-2">
          <CheckboxField
            name="is_active"
            label="Activă"
            defaultChecked={schedule ? schedule.is_active : true}
          />
        </div>
      </FormGrid>
    </AdminFormFrame>
  );
}
