/**
 * Primitive de skeleton pentru stările `loading.tsx`. Rezervă spațiu real
 * (înălțimi fixe) ca să mențină CLS la zero în timp ce conținutul dinamic
 * face streaming. `animate-pulse` e dezactivat automat pentru utilizatorii cu
 * `prefers-reduced-motion` (vezi globals.css).
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-olive/10 ${className}`}
      aria-hidden="true"
    />
  );
}

/** Bloc hero generic pentru paginile cu antet vizual. */
export function HeroSkeleton() {
  return (
    <div className="relative min-h-[420px] overflow-hidden bg-olive/5 md:min-h-[520px]">
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center gap-5 px-5 py-20 md:px-10 lg:px-16">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-12 w-2/3 max-w-xl" />
        <Skeleton className="mt-2 h-5 w-1/2 max-w-md" />
      </div>
    </div>
  );
}

/** Grilă de carduri (pentru liste: blog, utilaje, proiecte). */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:grid-cols-2 md:px-10 lg:grid-cols-3 lg:px-16">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

/** Bloc de articol (pentru pagini de detaliu cu mult text). */
export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:px-10">
      <div className="flex flex-col gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 3 === 0 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}
