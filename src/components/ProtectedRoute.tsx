"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/components/utils/actionsClient";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/account");
        return;
      }

      try {
        const user = await getUserInfo(token);
        if (!user) {
          router.push("/account");
        } else {
          // کاربر معتبره
          setLoading(false);
        }
      } catch (err) {
        router.push("/account");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <div>در حال بررسی ورود...</div>;

  return <>{children}</>;
}
