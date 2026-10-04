import Link from "next/link";
import { ROUTES } from "@/constants/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80dvh] flex-col justify-center py-24">
      <Badge variant="danger">404</Badge>
      <h1 className="display-tight mt-6 max-w-3xl text-4xl md:text-6xl">
        This page is not on the register
      </h1>
      <p className="measure mt-8 text-base text-quiet-ink">
        The address you followed does not exist on this site. The most likely
        places you want are the announcements, or the history of the college.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={ROUTES.home}>Return home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.announcements}>Announcements</Link>
        </Button>
      </div>
      <Link
        href={ROUTES.contact}
        className="wipe mt-10 inline-flex text-sm text-quiet-ink hover:text-brand"
      >
        Or contact the school office
      </Link>
    </div>
  );
}