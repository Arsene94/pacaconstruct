/**
 * Randează un obiect de date structurate ca `<script type="application/ld+json">`
 * direct în HTML-ul serverului (vizibil în „View Source", citibil de boții AI).
 *
 * Escaping-ul `<` → `<` previne injecția XSS prin date din DB, conform
 * recomandării din ghidul Next.js (`node_modules/next/dist/docs/.../json-ld.md`).
 */
export function JsonLd({
  data,
  id,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}) {
  return (
    <script
      type="application/ld+json"
      id={id ? `ld-${id}` : undefined}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
