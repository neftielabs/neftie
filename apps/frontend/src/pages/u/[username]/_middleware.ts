import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isValidAddress } from "@neftie/common";
import { serverClient } from "lib/http/serverClient";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const usernameOrId = url.pathname.replace("/u/", "");

  try {
    const user = await serverClient().query.getUser(usernameOrId);
    if (isValidAddress(usernameOrId)) {
      // Redirect to username
      url.pathname = `/u/${user.username}`;
      return NextResponse.redirect(url, 307);
    }
  } catch {
    url.pathname = "/404";
    return NextResponse.redirect(url, 307);
  }
}
