"use client";

import { useEffect } from "react";

export function HashScrollHandler() {
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const target = (e.target as HTMLElement).closest("a");
            if (!target) return;
            const href = target.getAttribute("href");
            if (!href) return;

            let hash = "";
            if (href.startsWith("#") && href.length > 1) {
                hash = href.slice(1);
            } else if (
                href.startsWith("/#") &&
                href.length > 2 &&
                (window.location.pathname === "/" || window.location.pathname === "")
            ) {
                hash = href.slice(2);
            }

            if (hash) {
                const el = document.getElementById(hash);
                if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.pushState(null, "", `#${hash}`);
                }
            }
        }

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return null;
}
