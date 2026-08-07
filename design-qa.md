# Design QA — mise en page éditoriale BEWEGT

- Source visual truth: `/var/folders/1k/_g7n0k6n7vg905p0v0qnk8h80000gn/T/codex-clipboard-e653fa70-0667-449a-af58-1155efae74fe.png`
- Source dimensions: 1768 × 2400 px
- Implementation route: `/blog/premiers-jours-de-la-photographie-en-afrique.html`
- Intended desktop viewport: 1440 px wide
- Intended mobile viewport: 390 px wide
- State: published article, top of page and editorial body
- Implementation screenshot: unavailable

## Full-view comparison evidence

The source image was opened at original resolution. The implementation could not be captured because this Codex sandbox refused local server binding, and Browser security policy blocks `file://` navigation. Build and DOM generation succeeded, but those checks are not substitutes for a browser-rendered comparison.

## Focused comparison evidence

Blocked for the same reason. The implemented selectors reproduce the selected structural direction: dark cinematic hero, BEWEGT Cormorant title, compact metadata, white editorial body, desktop floating media rail, and single-column mobile layout.

## Findings

- [P2] Browser-rendered fidelity remains unverified.
  - Location: article hero and responsive editorial body.
  - Evidence: no implementation screenshot could be captured at the matching viewport.
  - Impact: wrapping, image float behavior and exact vertical rhythm still need a visual browser check.
  - Fix: run the project preview in an environment that permits localhost, capture desktop and mobile, and compare them directly with the source.

## Comparison history

- Initial implementation used oversized uppercase Satoshi headings and a centered single-column article.
- The user selected a new reference with a serif title, denser rhythm and desktop media rail.
- The CSS and generated hero markup were revised to match that direction, but post-fix visual evidence remains unavailable.

## Required fidelity surfaces

- Fonts and typography: BEWEGT Cormorant Garamond, Manrope and Satoshi only; code-verified, browser rendering unverified.
- Spacing and layout rhythm: compact hero/body values and responsive breakpoints implemented; visually unverified.
- Colors and tokens: BEWEGT ink, ivory and restrained blue accent retained; visually unverified.
- Image quality and asset fidelity: existing authentic article images retained; responsive CDN behavior build-verified.
- Copy and content: existing published multilingual editorial content retained.

## Implementation checklist

- Capture desktop at 1440 px.
- Capture mobile at 390 px.
- Check hero title wrapping and focal crop.
- Check that floated figures do not create unwanted gaps.
- Check navigation contrast and footer transition.

final result: blocked
