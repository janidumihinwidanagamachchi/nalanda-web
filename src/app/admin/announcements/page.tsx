import type { Metadata } from "next";
import { AnnouncementsManager } from "@/components/admin/announcements-manager";

export const metadata: Metadata = { title: "Announcements" };

export default function AdminAnnouncementsPage() {
  return <AnnouncementsManager />;
}