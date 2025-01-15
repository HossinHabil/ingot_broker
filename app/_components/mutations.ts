import { env } from "@/env";
import { ApiResponse } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

export function useFetchData() {
    const query = useQuery<ApiResponse[]>({
        queryKey: ['data'],
        queryFn: async () => {
            const response = await fetch('/api/symbols');
            const data = await response.json();
            const selectedSymbols = data.sort(() => 0.5 - Math.random()).slice(0, 1);
            return selectedSymbols
        }
    })

    return query
}