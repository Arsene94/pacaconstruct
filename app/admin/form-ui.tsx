import type { ReactNode } from "react";

const inputClass =
  "h-9 w-full rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] px-3 text-sm text-[#171a16] outline-none transition focus:border-[#58683c] focus:ring-1 focus:ring-[#58683c]";
const labelClass =
  "mb-1.5 block font-serif-display text-[11px] font-semibold uppercase tracking-wide text-[#6b706a]";

/** Grilă responsivă pentru câmpuri. */
export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-[11px] leading-4 text-[#6b706a]">{children}</p>;
}

export function TextField({
  name,
  label,
  defaultValue,
  placeholder,
  required,
  type = "text",
  hint,
  full,
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  required?: boolean;
  type?: string;
  hint?: ReactNode;
  full?: boolean;
}) {
  return (
    <label className={full ? "block md:col-span-2" : "block"}>
      <span className={labelClass}>
        {label}
        {required ? <span className="text-[#b91c1c]"> *</span> : null}
      </span>
      <input
        className={inputClass}
        defaultValue={defaultValue ?? undefined}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
      {hint ? <FieldHint>{hint}</FieldHint> : null}
    </label>
  );
}

export function TextAreaField({
  name,
  label,
  defaultValue,
  placeholder,
  rows = 4,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  rows?: number;
  hint?: ReactNode;
}) {
  return (
    <label className="block md:col-span-2">
      <span className={labelClass}>{label}</span>
      <textarea
        className="w-full rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] px-3 py-2 text-sm leading-6 text-[#171a16] outline-none transition focus:border-[#58683c] focus:ring-1 focus:ring-[#58683c]"
        defaultValue={defaultValue ?? undefined}
        name={name}
        placeholder={placeholder}
        rows={rows}
      />
      {hint ? <FieldHint>{hint}</FieldHint> : null}
    </label>
  );
}

export function SelectField({
  name,
  label,
  options,
  defaultValue,
  required,
  includeEmpty,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string | null;
  required?: boolean;
  includeEmpty?: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>
        {label}
        {required ? <span className="text-[#b91c1c]"> *</span> : null}
      </span>
      <select
        className={inputClass}
        defaultValue={defaultValue ?? ""}
        name={name}
        required={required}
      >
        {includeEmpty !== undefined ? (
          <option value="">{includeEmpty}</option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#171a16]">
      <input
        className="h-4 w-4 rounded-[2px] border-[#e6e1d7] accent-[#58683c]"
        defaultChecked={defaultChecked}
        name={name}
        type="checkbox"
      />
      {label}
    </label>
  );
}
