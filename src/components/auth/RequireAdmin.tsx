import { RequireRole } from "./RequireRole";

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  return <RequireRole allowedRoles={[3]}>{children}</RequireRole>;
};
