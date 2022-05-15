export const routes = {
  home: "/",

  about: "/about", // tbd
  careers: "/careers", // tbd (3rd party)
  privacyPolicy: "/privacy-policy", // tbd
  termsOfService: "/terms", // tbd

  user: (u: string) => ({
    index: `/${u}`,
    work: `/${u}/work`,
    reviews: `/${u}/reviews`,
    listings: `/${u}/listings`,
    about: `/${u}/about`,
  }),

  create: "/create",

  connect: "/connect",
  connectNext: (next: string) => `/connect?next=${encodeURIComponent(next)}`,

  listing: (address: string) => ({
    index: `/l/${address}`,
    edit: `/l/${address}`,
  }),
};
