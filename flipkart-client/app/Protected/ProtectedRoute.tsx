"use client";

import { useRouter } from "next/router";
import { useAppSelector } from "../hooks/hooks";

function ProtectedRoute() {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.authenticator.isLoggedIn);
  if (isLoggedIn) {
    router.push("/register");
  } else {
    router.push("/login");
  }
}

export default ProtectedRoute;
