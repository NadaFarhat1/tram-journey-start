# TRAM Home Workspace Foundation

## Goal
Turn the existing `/home` destination into the requested workspace shell without changing the current Login, Sign Up, Forgot Password, Leader, or Member pages.

## Implementation
- Create a reusable `Dashboard` layout that fills the screen with a left sidebar and main content area, with no top navigation bar.
- Refine the existing sidebar into reusable `Sidebar` and `SidebarItem` components using the requested Lucide outline icons, exact TRAM palette, lightweight spacing, and clear active/inactive states.
- Keep `Projects` as the default `/home` view.
- Add a dedicated route for each sidebar destination so clicking an item updates the URL, active state, and main content:
  - `/home/risk-alerts`
  - `/home/requests`
  - `/home/meetings`
  - `/home/reports`
  - `/home/members`
  - `/home/notifications`
  - `/home/settings`
- Show only a minimal heading and “Coming soon” placeholder in each content area.
- Preserve the current successful-login, project-creation, and project-join redirects to `/home`.
- Keep a compact mobile navigation treatment so every destination remains accessible on smaller screens.

## Technical details
- Promote `src/routes/home.tsx` to a layout route rendering an outlet, and move the default Projects screen into `src/routes/home.index.tsx`.
- Add route-specific metadata for each new content route.
- Reuse the existing semantic TRAM color tokens; no gradients, decorative icon colors, heavy shadows, or unnecessary motion.
- Verify the default Projects state and sidebar switching at desktop and mobile sizes.
