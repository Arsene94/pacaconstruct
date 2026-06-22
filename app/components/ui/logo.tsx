import { siteConfig } from "@/app/lib/site-config";

// Dimensiunea intrinsecă a logo-ului trimuit (vezi public/logo/logo-full.webp).
const INTRINSIC_WIDTH = 1042;
const INTRINSIC_HEIGHT = 402;

// Lățimile pre-generate ca .webp în public/logo/ — browserul alege singur
// varianta potrivită pentru densitatea ecranului (1x/2x/3x) prin srcSet + sizes.
// `default`  → logo full-color, pentru fundaluri deschise (navbar).
// `footer`   → bannerul aproape negru ridicat la olive-deschis, ca să se separe
//              de fundalul închis al footer-ului (păstrează culorile și textul).
const VARIANTS = {
  default: [120, 160, 200, 240, 320, 400, 480, 640, 800, 960],
  footer: [120, 160, 200, 240, 320, 400, 480, 640],
} as const;

const FILE_BASE = {
  default: "logo",
  footer: "logo-footer",
} as const;

type LogoVariant = keyof typeof VARIANTS;

function buildSrcSet(variant: LogoVariant): string {
  const base = FILE_BASE[variant];
  return VARIANTS[variant].map((w) => `/logo/${base}-${w}w.webp ${w}w`).join(", ");
}

type LogoProps = {
  /** Variantă vizuală în funcție de fundal (deschis = `default`, închis = `footer`). */
  variant?: LogoVariant;
  /** Clase pentru a controla înălțimea afișată (ex. `h-9 md:h-11`). */
  className?: string;
  /**
   * Hint `sizes` pentru selectarea variantei din srcSet (lățimea CSS estimată
   * a logo-ului pe fiecare breakpoint).
   */
  sizes?: string;
  /**
   * Logo „above the fold” (navbar): încarcă eager + fetchPriority high.
   * Restul (footer) rămân lazy.
   */
  priority?: boolean;
};

/**
 * Logo PACA CONSTRUCT, responsive pe device.
 *
 * Folosește variantele `.webp` din `public/logo/` printr-un `srcSet` clasic,
 * astfel încât fiecare device descarcă exact dimensiunea de care are nevoie.
 * `width`/`height` păstrează raportul intrinsec ca să nu existe CLS;
 * dimensiunea reală vine din clasele Tailwind (`h-* w-auto`).
 */
export function Logo({
  variant = "default",
  className,
  sizes = "(min-width: 768px) 240px, 160px",
  priority = false,
}: LogoProps) {
  const base = FILE_BASE[variant];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- asset pre-optimizat (webp), servit prin srcSet; nu trecem prin /_next/image.
    <img
      src={`/logo/${base}-480w.webp`}
      srcSet={buildSrcSet(variant)}
      sizes={sizes}
      width={INTRINSIC_WIDTH}
      height={INTRINSIC_HEIGHT}
      alt={`${siteConfig.name} logo`}
      className={className}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
