import { HeroSkeleton, CardGridSkeleton } from "@/app/components/skeleton";

export default function Loading() {
  return (
    <div className="flex-1">
      <HeroSkeleton />
      <CardGridSkeleton count={6} />
    </div>
  );
}
