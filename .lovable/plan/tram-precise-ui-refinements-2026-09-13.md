# TRAM precise UI refinements

## Scope
- Keep every existing page, layout, color, type style, label, validation rule, and account flow unchanged outside the three requested refinements.

## Changes
1. Make the Sign Up phone control a single bordered field containing the country-code selector, subtle divider, and phone input. The menu will show country names with codes; the closed selector will show only the code.
2. Move the existing password requirements control directly below the password field, aligned left, without changing its content or behavior.
3. Add a shared Login ↔ Sign Up navigation transition. On desktop, capture the current split layout and animate its visual and form regions horizontally into mirrored positions over roughly 600ms before normal routing. On mobile, use a restrained vertical movement. Respect reduced-motion preferences and keep the final route layout authoritative.

## Verification
- Check Login and Sign Up at desktop and mobile sizes.
- Confirm country selection, password help, both navigation directions, no horizontal overflow, reduced motion, and clean browser/build diagnostics.

## Technical details
- Reuse the existing visual panel and form markup; no replacement artwork or page restructuring.
- Use browser-native snapshot transitions when supported, with a scoped CSS fallback that preserves ordinary routing.
