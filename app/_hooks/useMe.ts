import { useFetch } from "@/app/_hooks/useFetch";
import { UserResponse } from "@/app/_types/me/UserResponse";

export const useMe = () => {
  return useFetch<UserResponse>("/api/me");
};
