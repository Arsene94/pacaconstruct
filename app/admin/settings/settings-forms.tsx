"use client";

import { IconArrowDown, IconArrowUp, IconPlus, IconTrash } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useActionState, useState } from "react";
import {
  updateAnnouncement,
  updateContactSettings,
  updateFloatingSettings,
  updateHours,
  updatePhones,
  updateSocial,
  type SettingsFormState,
} from "@/app/actions/settings";
import {
  DEFAULT_WHATSAPP_MESSAGE,
  type Announcement,
  type ContactInfo,
  type FloatingConfig,
  type OpeningHours,
  type PhoneNumber,
  type ResolvedSettings,
  type SocialLinks,
} from "@/app/lib/settings-shared";
import { AdminIcon } from "../admin-icons";
import { SubmitButton } from "../form-client";

// ─── Stiluri partajate (aliniate cu form-ui.tsx) ─────────────────────────────

const inputClass =
  "h-9 w-full rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] px-3 text-sm text-[#171a16] outline-none transition focus:border-[#58683c] focus:ring-1 focus:ring-[#58683c]";
const labelClass =
  "mb-1.5 block font-serif-display text-[11px] font-semibold uppercase tracking-wide text-[#6b706a]";

// ─── Câmpuri controlate ──────────────────────────────────────────────────────

function Text({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: ReactNode;
  inputMode?: "text" | "decimal" | "tel" | "url" | "email";
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {hint ? <p className="mt-1 text-[11px] leading-4 text-[#6b706a]">{hint}</p> : null}
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#171a16]">
      <input
        checked={checked}
        className="h-4 w-4 rounded-[2px] border-[#e6e1d7] accent-[#58683c]"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      {label}
    </label>
  );
}

function Banner({ state }: { state: SettingsFormState }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <div
        className="flex items-center gap-2 rounded-[2px] border border-[#15803d]/30 bg-[#15803d]/10 px-3 py-2 text-xs font-semibold text-[#15803d]"
        role="status"
      >
        <AdminIcon className="h-4 w-4" name="check" />
        {state.info ?? "Salvat."}
      </div>
    );
  }
  return (
    <div
      className="flex items-center gap-2 rounded-[2px] border border-[#b91c1c]/30 bg-[#ffdad6]/40 px-3 py-2 text-xs font-semibold text-[#93000a]"
      role="alert"
    >
      <AdminIcon className="h-4 w-4" name="warning" />
      {state.error}
    </div>
  );
}

/**
 * Înveliș de card+formular: leagă Server Action-ul prin `useActionState`,
 * serializează `payload` în câmpul ascuns `data` și afișează eroare/succes.
 */
function SectionCard<T>({
  id,
  title,
  description,
  action,
  payload,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  action: (state: SettingsFormState, form: FormData) => Promise<SettingsFormState>;
  payload: T;
  children: ReactNode;
}) {
  const [state, formAction] = useActionState<SettingsFormState, FormData>(
    action,
    undefined,
  );
  return (
    <section id={id} className="scroll-mt-20">
      <form
        action={formAction}
        className="space-y-5 rounded-[2px] border border-[#e6e1d7] bg-white p-5 shadow-sm md:p-6"
      >
        <div>
          <h2 className="text-lg font-semibold leading-6 text-[#171a16]">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs leading-4 text-[#6b706a]">{description}</p>
          ) : null}
        </div>

        <Banner state={state} />

        <div className="space-y-4">{children}</div>

        <input name="data" type="hidden" value={JSON.stringify(payload)} />

        <div className="flex items-center justify-end border-t border-[#e6e1d7] pt-4">
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  icon: Icon,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon: typeof IconPlus;
  danger?: boolean;
}) {
  return (
    <button
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] p-1.5 text-[#6b706a] transition-colors disabled:opacity-40 ${
        danger ? "hover:text-[#b91c1c]" : "hover:text-[#58683c]"
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}

// ─── Telefoane & WhatsApp ────────────────────────────────────────────────────

function newPhone(order: number): PhoneNumber {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `phone-${order}-${Date.now()}`,
    label: "Telefon",
    e164: "",
    display: "",
    whatsapp: false,
    isPrimary: false,
    showInFloating: true,
    order,
  };
}

function PhonesForm({ phones: initial }: { phones: PhoneNumber[] }) {
  const [phones, setPhones] = useState<PhoneNumber[]>(initial);

  function patch(index: number, changes: Partial<PhoneNumber>) {
    setPhones((list) => list.map((p, i) => (i === index ? { ...p, ...changes } : p)));
  }

  function setPrimary(index: number) {
    setPhones((list) => list.map((p, i) => ({ ...p, isPrimary: i === index })));
  }

  function add() {
    setPhones((list) => [...list, newPhone(list.length)]);
  }

  function remove(index: number) {
    setPhones((list) => {
      const next = list.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i }));
      if (next.length && !next.some((p) => p.isPrimary)) next[0].isPrimary = true;
      return next;
    });
  }

  function move(index: number, delta: number) {
    setPhones((list) => {
      const target = index + delta;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((p, i) => ({ ...p, order: i }));
    });
  }

  // Sincronizează `order` cu poziția înainte de serializare.
  const payload = phones.map((p, i) => ({ ...p, order: i }));

  return (
    <SectionCard
      action={updatePhones}
      description="Numere de telefon afișate pe site. Marchează unul ca principal și activează WhatsApp acolo unde e cazul."
      id="telefoane"
      payload={payload}
      title="Telefoane & WhatsApp"
    >
      <div className="space-y-4">
        {phones.map((phone, index) => (
          <fieldset
            key={phone.id}
            className="space-y-4 rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3]/40 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <legend className="font-serif-display text-[11px] font-semibold uppercase text-[#6b706a]">
                Număr {index + 1}
              </legend>
              <div className="flex items-center gap-1.5">
                <IconBtn
                  disabled={index === 0}
                  icon={IconArrowUp}
                  label="Mută mai sus"
                  onClick={() => move(index, -1)}
                />
                <IconBtn
                  disabled={index === phones.length - 1}
                  icon={IconArrowDown}
                  label="Mută mai jos"
                  onClick={() => move(index, 1)}
                />
                <IconBtn
                  danger
                  disabled={phones.length === 1}
                  icon={IconTrash}
                  label="Șterge numărul"
                  onClick={() => remove(index)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Text
                label="Etichetă"
                onChange={(v) => patch(index, { label: v })}
                placeholder="Dispecerat, Birou, Vânzări…"
                value={phone.label}
              />
              <Text
                hint="Format internațional, ex: +40712345678"
                inputMode="tel"
                label="Număr (E.164)"
                onChange={(v) => patch(index, { e164: v })}
                placeholder="+40712345678"
                value={phone.e164}
              />
              <Text
                label="Afișare"
                onChange={(v) => patch(index, { display: v })}
                placeholder="+40 712 345 678"
                value={phone.display}
              />
              <Text
                hint="Folosit la deschiderea WhatsApp"
                label="Mesaj WhatsApp (opțional)"
                onChange={(v) => patch(index, { whatsappMessage: v })}
                placeholder={DEFAULT_WHATSAPP_MESSAGE}
                value={phone.whatsappMessage ?? ""}
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <label className="flex items-center gap-2 text-sm text-[#171a16]">
                <input
                  checked={phone.isPrimary}
                  className="h-4 w-4 accent-[#58683c]"
                  name="primary-phone"
                  onChange={() => setPrimary(index)}
                  type="radio"
                />
                Principal
              </label>
              <Check
                checked={phone.whatsapp}
                label="Are WhatsApp"
                onChange={(v) => patch(index, { whatsapp: v })}
              />
              <Check
                checked={phone.showInFloating}
                label="Arată în butonul flotant"
                onChange={(v) => patch(index, { showInFloating: v })}
              />
            </div>
          </fieldset>
        ))}
      </div>

      <button
        className="flex h-9 items-center justify-center gap-2 rounded-[2px] border border-[#e6e1d7] bg-white px-4 text-xs font-medium text-[#171a16] shadow-sm transition-colors hover:bg-[#fbf9f3]"
        onClick={add}
        type="button"
      >
        <IconPlus aria-hidden="true" className="h-4 w-4" />
        Adaugă număr
      </button>
    </SectionCard>
  );
}

// ─── Butoane flotante ────────────────────────────────────────────────────────

function FloatingForm({
  floating: initial,
  phones,
}: {
  floating: FloatingConfig;
  phones: PhoneNumber[];
}) {
  const [cfg, setCfg] = useState<FloatingConfig>(initial);

  function set<K extends keyof FloatingConfig>(key: K, value: FloatingConfig[K]) {
    setCfg((c) => ({ ...c, [key]: value }));
  }
  function setChannel(key: keyof FloatingConfig["channels"], value: boolean) {
    setCfg((c) => ({ ...c, channels: { ...c.channels, [key]: value } }));
  }

  const whatsappOptions = phones.filter((p) => p.whatsapp);

  return (
    <SectionCard
      action={updateFloatingSettings}
      description="Butoanele flotante de pe site-ul public (apel, WhatsApp, scroll-sus, email)."
      id="flotante"
      payload={cfg}
      title="Butoane flotante"
    >
      <Check
        checked={cfg.enabled}
        label="Activează butoanele flotante"
        onChange={(v) => set("enabled", v)}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Poziție</span>
          <select
            className={inputClass}
            onChange={(e) =>
              set("position", e.target.value === "left" ? "left" : "right")
            }
            value={cfg.position}
          >
            <option value="right">Dreapta-jos</option>
            <option value="left">Stânga-jos</option>
          </select>
        </label>
      </div>

      <div>
        <span className={labelClass}>Canale</span>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Check
            checked={cfg.channels.whatsapp}
            label="WhatsApp"
            onChange={(v) => setChannel("whatsapp", v)}
          />
          <Check
            checked={cfg.channels.call}
            label="Apel"
            onChange={(v) => setChannel("call", v)}
          />
          <Check
            checked={cfg.channels.scrollTop}
            label="Scroll sus"
            onChange={(v) => setChannel("scrollTop", v)}
          />
          <Check
            checked={cfg.channels.email}
            label="Email"
            onChange={(v) => setChannel("email", v)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Check
          checked={cfg.showOnMobile}
          label="Arată pe mobil"
          onChange={(v) => set("showOnMobile", v)}
        />
        <Check
          checked={cfg.showOnDesktop}
          label="Arată pe desktop"
          onChange={(v) => set("showOnDesktop", v)}
        />
        <Check
          checked={cfg.expandLabels}
          label="Etichete la hover"
          onChange={(v) => set("expandLabels", v)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Număr pentru WhatsApp</span>
          <select
            className={inputClass}
            onChange={(e) => set("whatsappPhoneId", e.target.value || undefined)}
            value={cfg.whatsappPhoneId ?? ""}
          >
            <option value="">Automat (primul cu WhatsApp)</option>
            {whatsappOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} — {p.display}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Număr pentru apel</span>
          <select
            className={inputClass}
            onChange={(e) => set("callPhoneId", e.target.value || undefined)}
            value={cfg.callPhoneId ?? ""}
          >
            <option value="">Automat (principal)</option>
            {phones.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} — {p.display}
              </option>
            ))}
          </select>
        </label>
      </div>

      <FloatingPreview cfg={cfg} />
    </SectionCard>
  );
}

/** Preview live minimal al stack-ului de butoane. */
function FloatingPreview({ cfg }: { cfg: FloatingConfig }) {
  const dots: { key: string; label: string; bg: string }[] = [];
  if (cfg.channels.scrollTop) dots.push({ key: "top", label: "↑", bg: "bg-[#6b706a]" });
  if (cfg.channels.email) dots.push({ key: "mail", label: "@", bg: "bg-[#58683c]" });
  if (cfg.channels.call) dots.push({ key: "call", label: "☎", bg: "bg-[#1e2a20]" });
  if (cfg.channels.whatsapp) dots.push({ key: "wa", label: "W", bg: "bg-[#25d366]" });

  return (
    <div>
      <span className={labelClass}>Previzualizare</span>
      <div className="relative h-40 overflow-hidden rounded-[2px] border border-dashed border-[#e6e1d7] bg-[#fbf9f3]">
        {cfg.enabled && dots.length ? (
          <div
            className={`absolute bottom-3 flex flex-col items-center gap-2 ${
              cfg.position === "left" ? "left-3" : "right-3"
            }`}
          >
            {dots.map((d) => (
              <span
                key={d.key}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${d.bg}`}
              >
                {d.label}
              </span>
            ))}
          </div>
        ) : (
          <p className="flex h-full items-center justify-center text-xs text-[#6b706a]">
            {cfg.enabled ? "Niciun canal activ" : "Butoane dezactivate"}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Contact & locație ───────────────────────────────────────────────────────

function ContactForm({ contact: initial }: { contact: ContactInfo }) {
  const [c, setC] = useState<ContactInfo>(initial);
  function set<K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) {
    setC((prev) => ({ ...prev, [key]: value }));
  }
  function setAddr(key: keyof ContactInfo["address"], value: string) {
    setC((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
  }
  function setGeo(key: keyof ContactInfo["geo"], value: string) {
    const n = Number(value);
    setC((prev) => ({
      ...prev,
      geo: { ...prev.geo, [key]: Number.isFinite(n) ? n : 0 },
    }));
  }

  return (
    <SectionCard
      action={updateContactSettings}
      description="Email, adresă, hartă și coordonate geografice (folosite și în JSON-LD)."
      id="contact"
      payload={c}
      title="Contact & locație"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Text
          inputMode="email"
          label="Email principal"
          onChange={(v) => set("emailPrimary", v)}
          type="email"
          value={c.emailPrimary}
        />
        <Text
          inputMode="email"
          label="Email office"
          onChange={(v) => set("emailOffice", v)}
          type="email"
          value={c.emailOffice}
        />
        <Text
          label="Stradă și număr"
          onChange={(v) => setAddr("streetAddress", v)}
          value={c.address.streetAddress}
        />
        <Text
          label="Oraș"
          onChange={(v) => setAddr("addressLocality", v)}
          value={c.address.addressLocality}
        />
        <Text
          label="Județ"
          onChange={(v) => setAddr("addressRegion", v)}
          value={c.address.addressRegion}
        />
        <Text
          label="Cod poștal"
          onChange={(v) => setAddr("postalCode", v)}
          value={c.address.postalCode}
        />
        <Text
          hint="Cod ISO de 2 litere (ex: RO)"
          label="Țară"
          onChange={(v) => setAddr("addressCountry", v.toUpperCase())}
          value={c.address.addressCountry}
        />
        <Text
          inputMode="url"
          label="Link hartă (mapUrl)"
          onChange={(v) => set("mapUrl", v)}
          placeholder="https://maps.google.com/?q=…"
          value={c.mapUrl}
        />
        <Text
          inputMode="decimal"
          label="Latitudine"
          onChange={(v) => setGeo("latitude", v)}
          value={String(c.geo.latitude)}
        />
        <Text
          inputMode="decimal"
          label="Longitudine"
          onChange={(v) => setGeo("longitude", v)}
          value={String(c.geo.longitude)}
        />
      </div>
    </SectionCard>
  );
}

// ─── Program ─────────────────────────────────────────────────────────────────

const DAYS: { value: string; label: string }[] = [
  { value: "Monday", label: "Lun" },
  { value: "Tuesday", label: "Mar" },
  { value: "Wednesday", label: "Mie" },
  { value: "Thursday", label: "Joi" },
  { value: "Friday", label: "Vin" },
  { value: "Saturday", label: "Sâm" },
  { value: "Sunday", label: "Dum" },
];

function HoursForm({ hours: initial }: { hours: OpeningHours[] }) {
  const [slots, setSlots] = useState<OpeningHours[]>(initial);

  function patch(index: number, changes: Partial<OpeningHours>) {
    setSlots((list) => list.map((s, i) => (i === index ? { ...s, ...changes } : s)));
  }
  function toggleDay(index: number, day: string) {
    setSlots((list) =>
      list.map((s, i) => {
        if (i !== index) return s;
        const days = s.days.includes(day)
          ? s.days.filter((d) => d !== day)
          : [...s.days, day];
        return { ...s, days };
      }),
    );
  }
  function add() {
    setSlots((list) => [
      ...list,
      { days: [], opens: "08:00", closes: "18:00", label: "", closed: false },
    ]);
  }
  function remove(index: number) {
    setSlots((list) => list.filter((_, i) => i !== index));
  }

  return (
    <SectionCard
      action={updateHours}
      description="Intervalele de program. Bifează zilele și completează orele; marchează o zi închisă cu „Închis”."
      id="program"
      payload={slots}
      title="Program de funcționare"
    >
      <div className="space-y-4">
        {slots.map((slot, index) => (
          <fieldset
            key={index}
            className="space-y-3 rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3]/40 p-4"
          >
            <div className="flex items-center justify-between">
              <legend className="font-serif-display text-[11px] font-semibold uppercase text-[#6b706a]">
                Interval {index + 1}
              </legend>
              <IconBtn
                danger
                icon={IconTrash}
                label="Șterge intervalul"
                onClick={() => remove(index)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const active = slot.days.includes(day.value);
                return (
                  <button
                    aria-pressed={active}
                    className={`rounded-[2px] border px-2.5 py-1 text-xs font-semibold transition-colors ${
                      active
                        ? "border-[#58683c] bg-[#58683c] text-white"
                        : "border-[#e6e1d7] bg-white text-[#6b706a] hover:bg-[#fbf9f3]"
                    }`}
                    key={day.value}
                    onClick={() => toggleDay(index, day.value)}
                    type="button"
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Text
                label="Deschidere"
                onChange={(v) => patch(index, { opens: v })}
                placeholder="08:00"
                type="time"
                value={slot.opens}
              />
              <Text
                label="Închidere"
                onChange={(v) => patch(index, { closes: v })}
                placeholder="18:00"
                type="time"
                value={slot.closes}
              />
              <Text
                label="Etichetă"
                onChange={(v) => patch(index, { label: v })}
                placeholder="L-V: 08:00 - 18:00"
                value={slot.label}
              />
            </div>

            <Check
              checked={slot.closed}
              label="Închis (nu apare în programul structurat)"
              onChange={(v) => patch(index, { closed: v })}
            />
          </fieldset>
        ))}
      </div>

      <button
        className="flex h-9 items-center justify-center gap-2 rounded-[2px] border border-[#e6e1d7] bg-white px-4 text-xs font-medium text-[#171a16] shadow-sm transition-colors hover:bg-[#fbf9f3]"
        onClick={add}
        type="button"
      >
        <IconPlus aria-hidden="true" className="h-4 w-4" />
        Adaugă interval
      </button>
    </SectionCard>
  );
}

// ─── Social ──────────────────────────────────────────────────────────────────

function SocialForm({ social: initial }: { social: SocialLinks }) {
  const [s, setS] = useState<SocialLinks>(initial);
  function set(key: keyof SocialLinks, value: string) {
    setS((prev) => ({ ...prev, [key]: value }));
  }
  return (
    <SectionCard
      action={updateSocial}
      description="Profiluri externe (schema sameAs). Lasă gol ce nu există."
      id="social"
      payload={s}
      title="Social & sameAs"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Text
          inputMode="url"
          label="Google Business"
          onChange={(v) => set("googleBusiness", v)}
          value={s.googleBusiness}
        />
        <Text
          inputMode="url"
          label="Facebook"
          onChange={(v) => set("facebook", v)}
          value={s.facebook}
        />
        <Text
          inputMode="url"
          label="Instagram"
          onChange={(v) => set("instagram", v)}
          value={s.instagram}
        />
        <Text
          inputMode="url"
          label="LinkedIn"
          onChange={(v) => set("linkedin", v)}
          value={s.linkedin}
        />
        <Text
          inputMode="url"
          label="TikTok"
          onChange={(v) => set("tiktok", v)}
          value={s.tiktok}
        />
        <Text
          inputMode="url"
          label="YouTube"
          onChange={(v) => set("youtube", v)}
          value={s.youtube}
        />
      </div>
    </SectionCard>
  );
}

// ─── Bară de anunț ───────────────────────────────────────────────────────────

function AnnouncementForm({ announcement: initial }: { announcement: Announcement }) {
  const [a, setA] = useState<Announcement>(initial);
  return (
    <SectionCard
      action={updateAnnouncement}
      description="Textul din bara de sus a navbar-ului (vizibilă pe desktop)."
      id="anunt"
      payload={a}
      title="Bară de anunț"
    >
      <Check
        checked={a.enabled}
        label="Afișează bara de anunț"
        onChange={(v) => setA((prev) => ({ ...prev, enabled: v }))}
      />
      <Text
        label="Text"
        onChange={(v) => setA((prev) => ({ ...prev, text: v }))}
        placeholder="Evaluare și ofertare pentru proiectul tău"
        value={a.text}
      />
      <Text
        hint="Opțional: dacă e completat, textul devine link."
        label="Link (opțional)"
        onChange={(v) => setA((prev) => ({ ...prev, href: v }))}
        placeholder="/contact"
        value={a.href ?? ""}
      />
    </SectionCard>
  );
}

// ─── Navigare în pagină + agregator ──────────────────────────────────────────

const SECTIONS = [
  { id: "telefoane", label: "Telefoane" },
  { id: "flotante", label: "Butoane flotante" },
  { id: "contact", label: "Contact" },
  { id: "program", label: "Program" },
  { id: "social", label: "Social" },
  { id: "anunt", label: "Anunț" },
];

export function SettingsForms({ settings }: { settings: ResolvedSettings }) {
  return (
    <div className="space-y-6">
      <nav
        aria-label="Secțiuni setări"
        className="flex flex-wrap gap-2 rounded-[2px] border border-[#e6e1d7] bg-white p-3"
      >
        {SECTIONS.map((s) => (
          <a
            className="rounded-[2px] border border-[#e6e1d7] bg-[#fbf9f3] px-3 py-1.5 text-xs font-semibold text-[#6b706a] transition-colors hover:text-[#58683c]"
            href={`#${s.id}`}
            key={s.id}
          >
            {s.label}
          </a>
        ))}
      </nav>

      <PhonesForm phones={settings.phones} />
      <FloatingForm floating={settings.floating} phones={settings.phones} />
      <ContactForm contact={settings.contact} />
      <HoursForm hours={settings.hours} />
      <SocialForm social={settings.social} />
      <AnnouncementForm announcement={settings.announcement} />
    </div>
  );
}
