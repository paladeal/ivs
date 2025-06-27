"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSupabaseSession } from "./useSupabaseSession";

export const useRouteGuard = () => {
  const { session, isLoading } = useSupabaseSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (session) return;
    router.replace("/");
  }, [isLoading, router, session]);
};
