import { AdminPage } from "@/src/components/admin";
import { RequireAdmin } from "@/src/components/auth/RequireAdmin";

export default function AdminRoute() {
  return (
    <RequireAdmin>
      <AdminPage />
    </RequireAdmin>
  );
}