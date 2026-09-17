import { Link, useNavigate } from "@tanstack/react-router";
import type { ComponentProps, MouseEvent } from "react";

type AuthDestination = "/" | "/signup";
type AuthDirection = "forward" | "reverse";
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> };
};

type AuthTransitionLinkProps = Omit<ComponentProps<typeof Link>, "to"> & {
  to: AuthDestination;
  direction: AuthDirection;
};

export function AuthTransitionLink({
  to,
  direction,
  onClick,
  ...props
}: AuthTransitionLinkProps) {
  const navigate = useNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const transitionDocument = document as ViewTransitionDocument;
    if (!transitionDocument.startViewTransition) return;

    event.preventDefault();
    document.documentElement.dataset["authTransition"] = direction;
    document.documentElement.classList.add("auth-transition-active");

    const transition = transitionDocument.startViewTransition(async () => {
      await navigate({ to });
    });

    void transition.finished.finally(() => {
      delete document.documentElement.dataset["authTransition"];
      document.documentElement.classList.remove("auth-transition-active");
    });
  }

  return <Link to={to} onClick={handleClick} {...props} />;
}