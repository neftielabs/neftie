import { useTypedMutation } from "hooks/http/useTypedMutation";
import { useToken } from "hooks/useToken";
import { useCallback } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";

export const useWallet = (): [
  boolean,
  () => Promise<{ error: string } | undefined>
] => {
  const [{ loading: isConnectLoading }] = useConnect();
  const [{ data: networkData, loading: isNetworkLoading }] = useNetwork();
  const [{ loading: isSignLoading }, signMessage] = useSignMessage();
  const [{ data: accountData, loading: isAccountLoading }] = useAccount();

  const { mutateAsync: getNonce } = useTypedMutation("getNonce");
  const { mutateAsync: connect } = useTypedMutation("authConnect");
  const { mutateAsync: disconnect } = useTypedMutation("disconnect");

  const [, { setToken }] = useToken();

  /**
   * In order for us to verify that the signer is actually
   * the one willing to perform the action, we request
   * a signature of a message using a random nonce. Once
   * verified, we can proceed to authenticate the user.
   */
  const requestSignature = useCallback(async () => {
    const address = accountData?.address;
    const chainId = networkData.chain?.id;

    if (!address || !chainId) {
      return { error: "An error occurred getting your address or chain" };
    }

    let nonce = "";

    /**
     * Request a nonce from the backend, that will get
     * stored in a token in order to ensure that it hasn't changed
     * throughout the process
     */
    try {
      nonce = await getNonce([]);
    } catch {
      return { error: "An error occurred while requesting the signature" };
    }

    /**
     * Build the message for the user to sign with
     * their wallet
     */
    const message = new SiweMessage({
      statement:
        "Welcome! Neftie requires you to sign this message with your wallet in order to verify that it is really you who is trying to use this account.",
      nonce,
      address,
      domain: window.location.host,
      uri: window.location.origin,
      version: "1",
      chainId,
    }).prepareMessage();

    const signedMessage = await signMessage({ message });

    if (signedMessage.error) {
      return {
        error: "Something went wrong while signing the message",
      };
    }

    /**
     * Verify everything with our backend, by sending the
     * message, the signature and the token already present in cookies
     * containing the nonce.
     */
    try {
      const { token, user } = await connect([
        { message, signature: signedMessage.data },
      ]);

      /**
       * Addresses must still match. Clear tokens if not.
       */
      if (accountData.address !== user.address) {
        await disconnect([]);
        return {
          error: "An error occurred, please try again",
        };
      }

      setToken({
        address: user.address,
        value: token,
      });
    } catch {
      return {
        error: "An error occurred verifying the signature",
      };
    }
  }, [
    accountData?.address,
    connect,
    disconnect,
    getNonce,
    networkData.chain?.id,
    setToken,
    signMessage,
  ]);

  const isLoading =
    !!isConnectLoading ||
    isAccountLoading ||
    !!isNetworkLoading ||
    !!isSignLoading;

  return [isLoading, requestSignature];
};
