import { Link as RouterLink } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
  scroll?: boolean;
};

/** Internal link that accepts "/path#hash" strings and keeps client-side navigation. */
export default function Link({ href, prefetch: _p, scroll: _s, ...rest }: Props) {
  if (!href.startsWith("/")) return <a href={href} {...rest} />;
  const [path, hash] = href.split("#");
  return <RouterLink to={path || "/"} hash={hash} {...rest} />;
}
