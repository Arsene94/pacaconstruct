"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

// Curba de easing „smooth" (ease-out, ușor exponențială) — intrare fermă la
// început, așezare lină la final. Folosită uniform pentru toate revelările.
const EASE = [0.22, 1, 0.36, 1] as const;

// Tag-urile permise; păstrăm semantica HTML (ex. `article` într-un grid rămâne
// item de grid, fără wrapper suplimentar care ar strica `col-span`/`row-span`).
const TAGS = {
  div: motion.div,
  article: motion.article,
  section: motion.section,
  li: motion.li,
} as const;

type RevealProps = HTMLMotionProps<"div"> & {
  /** Eticheta HTML randată (implicit `div`). */
  as?: keyof typeof TAGS;
  /** Întârziere (s) — folosește-o cu `index * pas` pentru un stagger pe grid. */
  delay?: number;
  /** Distanța (px) de pe care urcă elementul la intrare. */
  distance?: number;
};

/**
 * Revelează copiii la intrarea în viewport: fade + ridicare discretă, o singură
 * dată. Copiii pot fi randați pe server (sunt pasați ca output, nu intră în
 * graful de module al clientului — vezi docs Next „Interleaving Server and
 * Client Components"). Respectă `prefers-reduced-motion`: când e cerut, randăm
 * starea finală static, fără nicio animație.
 */
export function Reveal({
  as = "div",
  delay = 0,
  distance = 24,
  children,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as] as typeof motion.div;

  return (
    <Tag
      initial={reduce ? false : { opacity: 0, y: distance }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
