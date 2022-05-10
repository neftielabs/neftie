export const routes = {
  home: "/",

  about: "/about", // tbd
  careers: "/careers", // tbd (3rd party)
  privacyPolicy: "/privacy-policy", // tbd
  termsOfService: "/terms", // tbd

  user: (u: string) => ({
    work: `/${u}/work`,
    reviews: `/${u}/reviews`,
    services: `/${u}/services`,
    about: `/${u}/about`,
  }),

  create: "/create",
};
