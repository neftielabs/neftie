import { Signer } from "ethers";
import { UseMutationOptions, useMutation } from "react-query";
import { useSigner } from "wagmi";

type InjectSigner<D> = D & { signer: Signer };

/**
 * Wrapper for react-query's useMutation to automatically
 * inject the signer since it is always needed for each transaction.
 *
 * R = Return type on success
 * E = Return type on error
 * D = Args received by the handler
 */
export const useContractMutation = <R, E, D>(
  handler: (data: InjectSigner<D>) => Promise<R>,
  options?: UseMutationOptions<R, E, D, unknown>
) => {
  const [{ data: signer }] = useSigner();

  return useMutation<R, E, D, unknown>(async (data) => {
    if (!signer) {
      throw new Error("Signer unavailable");
    }

    return await handler({ ...data, signer });
  }, options);
};
