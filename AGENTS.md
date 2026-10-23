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
- Images live as Lovable asset pointers (`src/assets/*.asset.json`, use `.url`); the product catalog is static in `src/data/products.ts` and the cart is browser-only with WhatsApp checkout, so there is no database yet.
