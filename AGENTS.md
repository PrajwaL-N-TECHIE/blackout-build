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

- Keep organizer-supplied event rules in a shared browser-safe module and test concrete values, so event copy and future registration stay consistent.
- Use semantic global CSS tokens and shared UI controls for the illustrated event site, so its visual language stays consistent.
- Keep registration unavailable until the organizer supplies an actual registration destination or authorizes a stored application flow; never simulate successful applications.
