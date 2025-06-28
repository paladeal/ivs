"use client";
import useSWR from "swr";
import type { SWRConfiguration } from "swr";
import { api } from "../_lib/api";

export const useFetch = <T>(path: string, configuration?: SWRConfiguration) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  const fetcher = async () => {
    try {
      const res = await api.get<T>(path);
      return res;
    } catch (error) {
      throw error;
    }
  };
  const results = useSWR(`${baseUrl}${path}`, fetcher, configuration);
  return results;
};
