import { Skeleton } from "@/components/ui/skeleton";

export default function SymbolCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <SymbolCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SymbolCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`w-[300px] h-[200px] flex flex-col justify-around space-y-4 bg-card rounded-md p-4 ${className}`}
    >
      <Skeleton className="h-8 w-[200px] bg-card-foreground" />
      <Skeleton className="h-4 w-[200px] bg-card-foreground" />
      <Skeleton className="h-4 w-[200px] bg-card-foreground" />
    </div>
  );
}
