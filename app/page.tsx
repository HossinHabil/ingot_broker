import { env } from "@/env";
import { ApiResponse } from "@/utils/types";
import SymbolCard from "./_components/SymbolCard";
import { Suspense } from "react";
import SymbolCardsSkeleton from "./_components/SymbolCardsSkeleton";

export default function Home() {

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-center items-center space-y-8 py-8 px-4">
        <h2 className="text-primary-foreground text-2xl md:text-3xl lg:text-4xl">Ingot Brokers Assessment</h2>
        <Suspense fallback={<SymbolCardsSkeleton />}>
          <GetSymbols />
        </Suspense>
      </div>
    </main>
  );
}

async function GetSymbols() {
  const data = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/public/markets`);
  const markets = await data.json();
  const symbols:ApiResponse[] = markets.sort(() => 0.5 - Math.random()).slice(0, 5);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 justify-center items-center">
      {symbols.map((symbol) => (
          <SymbolCard key={symbol.name} item={symbol} />
        ))}
    </div>
  );
}
