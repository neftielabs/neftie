import * as yup from "yup";

export const fileUpload = yup.object({
  entity: yup.string().oneOf(["avatar", "banner"]).required(),
});

export const editProfile = (
  currentUsername?: string,
  checkUsername?: (username: string) => Promise<{ available: boolean }>
) => {
  return yup.object({
    name: yup
      .string()
      .notRequired()
      .matches(
        /^([ \u00c0-\u01ffa-zA-Z'-])+$/g,
        "name contains invalid characters"
      )
      .max(40)
      .min(1),

    username: yup
      .string()
      .notRequired()
      .max(20)
      .min(3)
      .matches(
        /^[a-z0-9_-]{3,15}$/gm,
        "only a-z, 0-9 and characters '-' and '_' are allowed"
      )
      .test(
        "Unique username",
        "username is taken",
        (v) =>
          new Promise((resolve) => {
            if (!v || !checkUsername || v === currentUsername) {
              resolve(true);
              return;
            }

            checkUsername(v)
              .then((result) => {
                if (result.available) {
                  resolve(true);
                  return;
                }

                resolve(false);
              })
              .catch(() => resolve(false));
          })
      ),

    twitter: yup
      .string()
      .notRequired()
      .matches(/(^|[^@\w])(\w{1,15})\b/, "invalid Twitter handle"),

    website: yup
      .string()
      .notRequired()
      .matches(
        /^((http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/g,
        "Invalid url"
      )
      .max(50),

    location: yup.string().notRequired().max(30),
    bio: yup.string().notRequired().max(500),
  });
};
