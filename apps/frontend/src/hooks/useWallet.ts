import { useClient } from "hooks/http/useClient";
import { useCallback } from "react";
import { SiweMessage } from "siwe";
import { useUserStore } from "stores/useUserStore";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";

export const useWallet = () => {
  const [{ loading: isConnectLoading }] = useConnect();
  const [{ data: accountData, loading: isAccountLoading }, disconnect] =
    useAccount();
  const [{ data: networkData, loading: isNetworkLoading }] = useNetwork();
  const [{ loading: isSignLoading }, signMessage] = useSignMessage();

  const client = useClient();
  const setUser = useUserStore((s) => s.setUser);

  /**
   * SIWE requires the user to sign a message
   * with their wallet in order to ensure they
   * have full rights on it.
   */
  const requestSignature = useCallback(async () => {
    const address = accountData?.address;
    const chainId = networkData.chain?.id;

    if (!address || !chainId) return;

    let nonce = "";

    try {
      nonce = await client.query.auth.getNonce();
    } catch {
      disconnect();
      return {
        error: "An error occurred requesting the signature",
      };
    }

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Neftie would like you to sign this message with your wallet",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    }).prepareMessage();

    const signResult = await signMessage({ message });

    if (signResult.error) {
      disconnect();
      return {
        error: "An error occurred while signing the message",
      };
    }

    try {
      const verifyResult = await client.mutation.auth.verifyMessage({
        message,
        signature: signResult.data,
      });

      setUser(verifyResult.user);
    } catch {
      disconnect();
      return {
        error: "An error occurred verifying the signature",
      };
    }
  }, [
    accountData?.address,
    client.mutation.auth,
    client.query.auth,
    disconnect,
    networkData.chain?.id,
    setUser,
    signMessage,
  ]);

  return {
    requestSignature,
    isLoading:
      isConnectLoading || isAccountLoading || isNetworkLoading || isSignLoading,
  };
};

/**
 * Steps are simple:
 *
 * 1 - Connect wallet
 * 2 - Sign message
 * 3 - Verify signed message
 * 4 - Store user in zustand
 */
