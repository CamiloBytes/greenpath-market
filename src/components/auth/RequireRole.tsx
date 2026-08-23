"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { useEffect } from "react";

export const RequireRole = ({
  allowedRoles,
  children,
}: {
  allowedRoles: number[];
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && !allowedRoles.includes(user.role_id ?? 0)) {
      router.replace("/dashboard");
    }
  }, [loading, user, router, allowedRoles]);

  if (loading || !user) return null;

  if (!allowedRoles.includes(user.role_id ?? 0)) return null;

  return <>{children}</>;
};
