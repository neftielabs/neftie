export const routes = {
  home: "/",

  notFound: "/404",

  about: "/about", // tbd
  careers: "/careers", // tbd (3rd party)
  privacyPolicy: "/privacy-policy", // tbd
  termsOfService: "/terms", // tbd

  user: (u: string) => ({
    index: `/u/${u}`,
  }),

  create: "/create",

  connect: "/connect",
  connectNext: (next = window.location.pathname) =>
    `/connect?next=${encodeURIComponent(next)}`,

  listing: (address: string) => ({
    index: `/l/${address}`,
    edit: `/l/${address}/edit`,
    order: `/l/${address}/order`,
  }),

  me: {
    orders: "/me/orders",
  },

  order: (listingId: string, orderId: number) => ({
    index: `/order/${listingId}/${orderId}`,
  }),
};
