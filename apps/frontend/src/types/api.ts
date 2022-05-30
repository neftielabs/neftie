import type {
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";

import type { apiClient } from "@neftie/api-client";

type ApiClient = typeof apiClient;

// Query

type QueryMethods = keyof ReturnType<ApiClient>["query"];
type CombinedQueryKey<K extends QueryMethods> = [
  K,
  ...(string | number | boolean)[]
];

export type UseTypedQuery = <K extends QueryMethods>(
  key: K | CombinedQueryKey<K>,
  opts?: UseQueryOptions,
  params?: Parameters<ReturnType<ApiClient>["query"][K]>
) => UseQueryResult<Awaited<ReturnType<ReturnType<ApiClient>["query"][K]>>>;

// Infinite queries

export type UseTypedInfQuery = <K extends QueryMethods>(
  key: K | CombinedQueryKey<K>,
  opts?: UseInfiniteQueryOptions<
    Awaited<ReturnType<ReturnType<ApiClient>["query"][K]>>
  >,
  params?: Parameters<ReturnType<ApiClient>["query"][K]>[0]
) => UseInfiniteQueryResult<
  Awaited<ReturnType<ReturnType<ApiClient>["query"][K]>>
>;

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

// Query update

export type UseTypedUpdateQuery = () => <K extends QueryMethods>(
  key: K | CombinedQueryKey<K>,
  updater: (
    arg1: Awaited<ReturnType<ReturnType<ApiClient>["query"][K]>>
  ) => Awaited<ReturnType<ReturnType<ApiClient>["query"][K]>>
) => void;
