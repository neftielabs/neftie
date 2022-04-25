import { apiClient } from "@neftie/api-client";
import { UseQueryOptions, UseQueryResult } from "react-query";

type ApiClient = typeof apiClient;

// Query

type QueryMethods = keyof ReturnType<ApiClient>["query"];
type PaginatedQueryMethod<K extends QueryMethods> = [
  K,
  ...(string | number | boolean)[]
];

export type UseTypedQuery = <K extends QueryMethods>(
  key: K | PaginatedQueryMethod<K>,
  opts?: UseQueryOptions,
  params?: Parameters<ReturnType<ApiClient>["query"][K]>
) => UseQueryResult<Awaited<ReturnType<ReturnType<ApiClient>["query"][K]>>>;

// Mutations
