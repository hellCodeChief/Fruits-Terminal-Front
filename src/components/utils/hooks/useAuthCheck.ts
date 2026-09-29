import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "@/app/store/index";
import Cookies from "js-cookie";
import { getUserInfo } from "@/components/utils/actionsClient";

export const useCheckAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      let cookieToken = Cookies.get("access_token");
      let localToken = localStorage.getItem("access_token");

      // 1️⃣ Determine final token (cookie has priority)
      let token = cookieToken || localToken;

      // 2️⃣ If token doesn't exist at all → stop
      if (!token) return;

      // 3️⃣ Sync storages:
      // If cookie missing but local has value → fill cookie
      if (!cookieToken && localToken) {
        Cookies.set("access_token", localToken, { expires: 1 });
      }

      // If localStorage missing but cookie has value → fill localStorage
      if (!localToken && cookieToken) {
        localStorage.setItem("access_token", cookieToken);
      }

      try {
        const userInfo = await getUserInfo(token);

        dispatch(loginSuccess({ token, userInfo }));

        // Ensure user info stored consistently
        Cookies.set("userInfo", JSON.stringify(userInfo), { expires: 1 });
      } catch (err) {
        // On failure → wipe everything
        Cookies.remove("access_token");
        Cookies.remove("userInfo");
        localStorage.removeItem("access_token");

        dispatch(logout());
      }
    };

    checkToken();
  }, []);
};
