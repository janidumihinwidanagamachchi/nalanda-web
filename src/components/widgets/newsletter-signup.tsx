import Link from "next/link";
import { Widget, WidgetLink } from "@/components/widgets/widget";
import { ROUTES } from "@/constants/site";

/**
 * The Buttondown username, or null when it has not been configured.
 *
 * Read at build time, which is what `NEXT_PUBLIC_` means for a static export:
 * the value is inlined into the HTML and there is no server left to change it.
 * Until it is set the widget falls back to a link rather than rendering a form
 * that would silently post nowhere, because a signup box that swallows
 * addresses is worse than no signup box.
 */
const BUTTONDOWN_USER = process.env.NEXT_PUBLIC_BUTTONDOWN_USER?.trim();

/**
 * Newsletter signup, posting directly to Buttondown.
 *
 * No client JavaScript and no API route: the form is a plain HTML POST that
 * Buttondown handles and responds to. That works with a static export, which a
 * self-hosted form handler could not.
 *
 * The email input is named `email` because Buttondown's endpoint expects that
 * field name specifically.
 */
export function NewsletterSignupWidget() {
  return (
    <Widget
      title="The bulletin"
      eyebrow="Newsletter"
      action={<WidgetLink href={ROUTES.newsletter}>About it</WidgetLink>}
    >
      <p className="text-sm text-quiet-ink">
        Term-by-term bulletins covering events across the school.
      </p>

      {BUTTONDOWN_USER ? (
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          action={`https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USER}`}
          method="post"
          target="popupwindow"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-lg border bg-canvas px-3 py-2 text-sm text-ink outline-none transition-colors duration-[var(--motion-fast)] focus:border-focus"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm text-brand-ink transition-opacity duration-[var(--motion-fast)] hover:opacity-90"
          >
            Subscribe
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-quiet-ink">
          Online signup is being set up. In the meantime,{" "}
          <Link href={ROUTES.newsletter} className="wipe text-brand">
            read about the bulletin
          </Link>{" "}
          or contact the office.
        </p>
      )}
    </Widget>
  );
}