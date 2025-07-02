import { supabase } from "./supabase";

const getAccessToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || "";
};
export const api = {
  get: async <ResponseType>(endpoint: string) => {
    try {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: await getAccessToken(),
        },
      });

      const data: ResponseType = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  },

  post: async <RequestType, ResponseType = undefined>(
    endpoint: string,
    payload: RequestType
  ) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: await getAccessToken(),
        },
        body: JSON.stringify(payload),
      });

      const data: ResponseType = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  put: async <RequestType, ResponseType>(
    endpoint: string,
    payload: RequestType
  ) => {
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: await getAccessToken(),
        },
        body: JSON.stringify(payload),
      });

      const data: ResponseType = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  },

  del: async <ResponseType>(endpoint: string) => {
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: await getAccessToken(),
        },
      });

      const data: ResponseType = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  },
};
