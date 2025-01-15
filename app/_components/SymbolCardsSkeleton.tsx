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

function SymbolCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`max-w-[265px] h-[194px] flex flex-col items-center justify-around space-y-4 bg-card rounded-md p-4 mx-auto w-full ${className}`}
    >
      <Skeleton className="h-8 w-[250px] bg-card-foreground" />
      <Skeleton className="h-4 w-[250px] bg-card-foreground" />
      <Skeleton className="h-4 w-[250px] bg-card-foreground" />
    </div>
  );
}
