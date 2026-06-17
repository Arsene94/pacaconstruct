import type { ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
};

export function SectionContainer({
  children,
  className = "",
}: SectionContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 md:px-10 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}
