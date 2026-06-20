/**
 * Calculează următoarea rulare pentru o programare de generare, pornind de la
 * `from` (implicit acum). Frecvențele suportate: zilnic, săptămânal, lunar.
 *
 * Pur (fără I/O), ca să poată fi folosit atât din server actions, cât și din
 * ruta de cron.
 */
export type ScheduleConfig = {
  frequency: string; // 'zilnic' | 'saptamanal' | 'lunar'
  hour: number;
  day_of_week: number | null; // 0=Duminică .. 6=Sâmbătă
  day_of_month: number | null; // 1-28
};

export function computeNextRun(cfg: ScheduleConfig, from: Date = new Date()): Date {
  const next = new Date(from);
  next.setSeconds(0, 0);
  next.setMinutes(0);
  next.setHours(Math.min(23, Math.max(0, cfg.hour || 0)));

  if (cfg.frequency === "zilnic") {
    if (next <= from) next.setDate(next.getDate() + 1);
    return next;
  }

  if (cfg.frequency === "lunar") {
    const dom = Math.min(28, Math.max(1, cfg.day_of_month ?? 1));
    next.setDate(dom);
    if (next <= from) next.setMonth(next.getMonth() + 1);
    return next;
  }

  // implicit: săptămânal
  const targetDow = cfg.day_of_week ?? 1; // Luni implicit
  const delta = (targetDow - next.getDay() + 7) % 7;
  next.setDate(next.getDate() + delta);
  if (next <= from) next.setDate(next.getDate() + 7);
  return next;
}
