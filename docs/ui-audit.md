# UI Design Audit — Frontend vs ui-design.pen

> Audit date: 2026-03-22
> Compared: Live frontend (localhost:4210) vs `docs/ui-design.pen` design file
> Screenshots: `docs/audit-screenshots/`

---

## Overall Assessment

The frontend faithfully reproduces the design's layout, navigation structure, color scheme, typography, and component hierarchy. The app shell (toolbar + sidenav), dark theme (#121212 background, #1E1E1E surfaces, #1A1A1A sidenav), Roboto font, Material Symbols Rounded icons, and #BB86FC accent color are all correct. The following items are deviations from the design that need to be addressed.

---

## Dashboard Screen

### D1 — Stat card icon circle background not visible
- **Design:** Each stat card icon sits inside a visible circular container with `#2C2C2C` background (48×48px).
- **Frontend:** The icon circle has the correct CSS but the icons appear to render outside the circle or the circle is not visually prominent enough at the rendered size.
- **Fix:** Verify `.icon-circle` renders at 48×48px with `#2C2C2C` background and the icon is centered inside it.

### D2 — Table relevance badge styling differs
- **Design:** Relevance badges are pill-shaped (`border-radius: 16px`) with colored backgrounds — green (`#1B5E20` bg / `#4CAF50` text) for high scores, purple (`#4A148C` bg / `#BB86FC` text) for medium scores.
- **Frontend:** Badges use `border-radius: 4px` (rounded rectangle, not pill), solid green (`#4CAF50`) background with dark (`#121212`) text for all scores.
- **Fix:** In `DataTableComponent`, change `badgeBg()` to return `#1B5E20` for high scores and `#4A148C` for medium. Change `badgeFg()` to return `#4CAF50` / `#BB86FC` accordingly. Change `.relevance-badge` `border-radius` from `4px` to `16px`.

### D3 — Table source chip text color
- **Design:** Source chips have gray `#3A3A3A` background with `#B0B0B0` text uniformly.
- **Frontend:** Source chips have `#3A3A3A` background but use source-specific colored text (`#BB86FC` for Eventbrite, `#03DAC6` for Meetup, `#FFB74D` for WebSearch).
- **Fix:** The colored source text is a nice enhancement and could be kept intentionally, but to match the design exactly, change `sourceColor()` in `DataTableComponent` to always return `#B0B0B0`.

### D4 — "Events This Week" stat always shows 0
- **Design:** Shows "47" as the Events This Week value.
- **Frontend:** Always shows "0" because the `DashboardComponent` doesn't compute a filtered count for the current week.
- **Fix:** In `DashboardComponent.loadData()`, compute a weekly count by filtering events whose `startDate` falls within the current week, or use `totalCount` as a fallback approximation.

---

## Events List Screen

### E1 — Relevance badge color scale mismatch
- **Design:** Relevance scores are on a 0–10 scale (e.g., 9.2, 8.7). Badge colors: green for high (≥8), purple for medium (≥6).
- **Frontend:** Relevance scores are on a 0–1 scale (e.g., 0.85, 0.92). The `EventCardComponent.badgeBackground()` thresholds check `score >= 8` which never matches 0–1 values, so all badges fall to the orange/low tier.
- **Fix:** Either normalize scores to 0–10 in the API layer, or update `badgeBackground()` / `badgeColor()` thresholds in `EventCardComponent` to use 0–1 scale: `>= 0.8` for green, `>= 0.6` for purple.

### E2 — Date filter placeholder text
- **Design:** Date filter shows "Date range" as label text with a calendar icon.
- **Frontend:** Date filter shows raw `yyyy-mm-dd` HTML date input placeholder with a calendar icon overlay.
- **Fix:** Replace the native `<input type="date">` with a styled text input or Angular Material datepicker that shows "Date range" as placeholder text.

### E3 — Count badge position and content
- **Design:** Count badge is a rounded pill (`#2C2C2C` background, white text) showing "1,284 events" positioned right of the "Events" title on the same line.
- **Frontend:** Count badge is a smaller circle showing just the number "7" positioned to the far right.
- **Fix:** Update the badge to include the word "events" (e.g., "7 events") and use `border-radius: 16px` with padding matching the design (`6px 14px`).

---

## Event Detail Screen

### ED1 — No issues found
The Event Detail screen is the most compliant. Title, relevance badge (green pill with star icon), metadata grid with purple icons, description section, tags as pills, and action buttons (Share outlined, Open Link teal filled) all match the design accurately.

---

## Sources Overview Screen

### S1 — "Last Sync" shows dash instead of time
- **Design:** Each source card shows a relative time (e.g., "2h ago", "4h ago", "6h ago") for the Last Sync value.
- **Frontend:** Shows "–" because the `SourceSummaryDto` from the backend doesn't include a `lastSyncTime` field, and the `SourcesOverviewComponent` hard-codes `'–'`.
- **Fix:** Add a `lastSyncTime` field to `SourceSummaryDto` in the backend, populate it from the most recent `CreatedAt` timestamp for events from each source, and expose it through the API. Update the frontend model and `SourcesOverviewComponent` to display it as a relative time string.

### S2 — Missing Meetup source card
- **Design:** Shows 3 source cards (Eventbrite, Meetup, WebSearch) with "3 active sources" subtitle.
- **Frontend:** Shows only 2 source cards (Eventbrite, WebSearch) with "2 active sources" because there are no Meetup events in the current database.
- **Fix:** This is data-driven and correct behavior. The Meetup card will appear when Meetup events are present. No code change needed — but consider showing all configured sources (even with 0 events) to match the design's intent.

### S3 — Source card icon circle size
- **Design:** Icon circle is 40×40px with the icon at 20px.
- **Frontend:** Icon circle renders correctly but the icon may appear slightly larger or smaller depending on the Material Symbols Rounded font rendering.
- **Fix:** Verify `.source-icon-circle` is exactly `40px × 40px` and `.source-icon` is `font-size: 20px`. Minor — low priority.

---

## Cross-Screen Issues

### X1 — Toolbar missing Google Fonts link for Material Symbols
- **Design:** Uses Material Symbols Rounded icons throughout.
- **Frontend:** Icons render correctly because `index.html` includes the Google Fonts link. No issue — but verify the font is loaded before first paint (consider `font-display: swap` or preload).

### X2 — Sidenav active highlight border-left accent
- **Design:** The active nav item has a subtle left border accent in `#BB86FC` on some screens (Events, Sources).
- **Frontend:** Active nav item uses only `background: #2C2C2C` highlight without a left border accent.
- **Fix:** Add a `3px solid #BB86FC` left border to `.nav-item.active` in the `SidenavComponent` styles.

### X3 — Toolbar bottom border color
- **Design:** Toolbar has a `1px` bottom border in `#333333`.
- **Frontend:** Toolbar has `border-bottom: 1px solid #333333`. Matches — no fix needed.

---

## Priority Summary

| ID | Screen | Severity | Description |
|----|--------|----------|-------------|
| **E1** | Events List | High | Relevance badge colors wrong due to 0–1 vs 0–10 scale mismatch |
| **D2** | Dashboard | Medium | Table relevance badges use wrong shape (rect vs pill) and colors |
| **S1** | Sources | Medium | Last Sync shows "–" instead of relative time |
| **E2** | Events List | Medium | Date filter shows raw `yyyy-mm-dd` instead of "Date range" label |
| **D4** | Dashboard | Medium | "Events This Week" always shows 0 |
| **E3** | Events List | Low | Count badge missing "events" text suffix |
| **X2** | All screens | Low | Sidenav active item missing left border accent |
| **D3** | Dashboard | Low | Table source chip text is colored instead of uniform gray |
| **D1** | Dashboard | Low | Stat card icon circle visibility |
| **S2** | Sources | Info | Missing Meetup card — data-driven, not a bug |
| **S3** | Sources | Info | Icon circle size may vary slightly with font rendering |
