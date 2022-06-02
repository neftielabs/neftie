export default {
  /**
   * Goerli
   */
  development: {
    core: "0x90d9378476527818790557f00a438190f9b87d30",
    listingFactory: "0xdd95e54924c9748dceD5C46d81c5cb52ea38Bfc8",
    // Don't use this, call the listing factory to get the implementation
    _listingImpl: "0xb49B61529B7fdB7e978C972dD5c02dbd09e94511",
  },

  /**
   * Mainnet
   */
  production: {
    core: "",
    coreProxy: "",
    listingFactory: "",
    listingImpl: "",
  },
};
