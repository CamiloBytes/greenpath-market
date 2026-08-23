import { RequireRole } from "./RequireRole";

export const RequireSeller = ({ children }: { children: React.ReactNode }) => {
  return <RequireRole allowedRoles={[2]}>{children}</RequireRole>;
};
