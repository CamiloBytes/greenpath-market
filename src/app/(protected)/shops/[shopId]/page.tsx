import { ShopDetailPage } from "@/src/components/shop";

export default async function ShopDetailRoute({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const { shopId } = await params;
  return <ShopDetailPage shopId={Number(shopId)} />;
}