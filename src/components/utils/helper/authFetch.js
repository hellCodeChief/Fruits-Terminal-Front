import { store } from "@/app/store/index";

export const authFetch = async (url, options = {}) => {
  let token = store.getState().user.accessToken;
  if (!token) {
    token = localStorage.getItem("access_token");
  }

  const isFormData = options.body instanceof FormData;

  const defaultHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Authorization: `Bearer ${token}`,
  };

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  return fetch(url, fetchOptions);
};
