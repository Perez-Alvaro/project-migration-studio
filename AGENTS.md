<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Site content was migrated from a Next.js project: use `@/components/shared/app-link` for "/path#hash" links and `@/components/shared/app-image` for images, because the ported components rely on those signatures.
- Images live as Lovable asset pointers (`src/assets/*.webp.asset.json`, use `.url`), pre-compressed to WebP (max 1200px) for page speed; fonts are self-hosted via @fontsource so there is no blocking Google Fonts request; the product catalog is static in `src/data/products.ts` and the cart is browser-only with WhatsApp checkout, so there is no database yet.

## Cloud architecture
- Theme values and legacy gradient aliases are centralized in `src/styles.css`; shared Button variants enforce touch-target sizing and CTA styling so user and admin views inherit theme updates together.
- Catalog, news, workshops, page sections and settings live in Lovable Cloud; public reads go through `src/lib/public.functions.ts` (publishable client) so SSR works without a session.
- Admin pages under `src/routes/_authenticated/admin/` write with the browser client; RLS + `has_role` is the security boundary.
- Public images go to the private `media` bucket and are served via `/media/*` (workspace blocks public buckets).
- Stock is only deducted when an admin confirms an order (`set_order_status`), never at checkout.
- Home page renders `page_sections` in `position` order; add new block types to `SECTION_TYPES` and the switch in `src/routes/index.tsx`.
