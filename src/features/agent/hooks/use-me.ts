"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api";
import { queryKeys } from "@/lib/react-query/query-keys";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: getMe,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
