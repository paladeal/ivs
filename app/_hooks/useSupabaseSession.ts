"use client";
import type { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "../_lib/supabase";

export const useSupabaseSession = () => {
  // undefind: ログイン状態ロード中, null: ログインしていない, Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setToken(session?.access_token || null);
      setIsLoading(false);
    };
    fetcher();
    // 認証状態の変更を監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setToken(session?.access_token || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { session, token, isLoading };
};
