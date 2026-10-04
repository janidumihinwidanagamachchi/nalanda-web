import type { Metadata } from "next";
import { NewsManager } from "@/components/admin/news-manager";

export const metadata: Metadata = { title: "News" };

export default function AdminNewsPage() {
  return <NewsManager />;
}