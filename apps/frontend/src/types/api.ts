import { apiClient } from "@neftie/api-client";
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";

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

type MutationMethods = keyof ReturnType<ApiClient>["mutation"];

export type UseTypedMutation = <
  K extends MutationMethods,
  M extends ReturnType<ApiClient>["mutation"][K],
  R extends Awaited<ReturnType<M>>,
  P extends Parameters<M>
>(
  key: K,
  opts?: UseMutationOptions<R, any, P, any>
) => UseMutationResult<R, any, P, any>;
