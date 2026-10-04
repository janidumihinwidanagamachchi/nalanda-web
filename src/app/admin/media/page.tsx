import type { Metadata } from "next";
import { MediaManager } from "@/components/admin/media-manager";

export const metadata: Metadata = { title: "Photographs" };

export default function AdminMediaPage() {
  return <MediaManager />;
}