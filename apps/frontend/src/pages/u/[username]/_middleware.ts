import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isValidAddress } from "@neftie/common";
import { serverClient } from "lib/http/serverClient";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const usernameOrId = url.pathname.replace("/u/", "");

  if (isValidAddress(usernameOrId)) {
    try {
      const user = await serverClient().query.getUser(usernameOrId);
      url.pathname = `/u/${user.username}`;

      return NextResponse.redirect(url, 307);
    } catch {}
  }
}
