import { RequireRole } from "./RequireRole";

export const RequireClient = ({ children }: { children: React.ReactNode }) => {
  return <RequireRole allowedRoles={[1]}>{children}</RequireRole>;
};
