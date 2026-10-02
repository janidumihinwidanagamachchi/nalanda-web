import Link from "next/link";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { MaskedText } from "@/components/motion/masked-text";
import { ROUTES } from "@/constants/site";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80dvh] flex-col justify-center py-24">
      <p className="font-mono text-sm tracking-[0.2em] text-accent">404</p>
      <MaskedText
        as="h1"
        text="This page is not on the register"
        animateOnMount
        className="display-tight mt-6 max-w-3xl text-4xl md:text-6xl"
      />
      <p className="measure mt-8 text-base leading-relaxed text-ink-muted">
        The address you followed does not exist on this site. The most likely places
        you want are the announcements, or the history of the college.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <MagneticButton href={ROUTES.home} variant="solid">
          Return home
        </MagneticButton>
        <MagneticButton href={ROUTES.announcements} variant="outline">
          Announcements
        </MagneticButton>
      </div>
      <Link
        href={ROUTES.contact}
        className="mt-10 inline-flex text-sm text-ink-muted underline underline-offset-4 transition-colors hover:text-accent"
      >
        Or contact the school office
      </Link>
    </div>
  );
}