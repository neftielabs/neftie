import { useEffect, useState } from "react";

import { useRouter } from "next/router";

export const useGetIntendedPath = () => {
  const router = useRouter();
  const [intendedPath, setIntendedPath] = useState<string>();

  useEffect(() => {
    if (router.query.next && typeof router.query.next === "string") {
      setIntendedPath(decodeURIComponent(router.query.next));
    }
  }, [router.query.next]);

  return intendedPath;
};
