import { MyShopPage } from "@/src/components/myshop";
import { RequireSeller } from "@/src/components/auth/RequireSeller";

export default function MyShopRoute() {
  return (
    <RequireSeller>
      <MyShopPage />
    </RequireSeller>
  );
}