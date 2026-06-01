# Enrichment notes — trail `02-s11` (Poutaz → Triatel, Torgnon, Valtournenche)

## Source data
Base facts read from `src/data/trails-skeleton.json` (record `02-s11`, SCT code `02_S11`):
- distance: 1.35427178878 km (kept verbatim)
- elevation_gain_m: 500, elevation_loss_m: 0 (one-way uphill route)
- difficulty: E (CAI)
- start: Poutaz, 1092 m, (45.81797, 7.58006)
- end: Triatel, 1612 m, (45.81860, 7.58953)
- valley: Valtournenche; municipality: Torgnon
- best_months: [6,7,8,9]; season: summer
- image / credit / source / gpx_path / SCT source block: carried over unchanged

Style/shape reference taken from an already-enriched record in `src/data/trails.json`
(`alta-via-1-tappa-1-donnas-perloz`) and the `Trail` schema in `src/lib/types.ts`.

## What I wrote
- **Editorial descriptions** (`description_it` + en/fr/de translations): 3-paragraph
  narrative — the steep climb and terrain, then the cultural payoff at Triatel, then
  practical framing. Replaced the auto-generated skeleton boilerplate (which had
  untranslated Italian month names leaking into en/fr/de).
- **shortDescription_*** (all 4 langs): editorial one-liners, each well under the 280-char
  schema cap (133/139/137/145).
- **name_*** : filled en/fr/de (were empty) with the canonical bilingual name.
- **cultural_notes_*** : focus on Triatel's ancient rural nucleus — rascard granaries on
  stone "mushrooms", 16th–17th c. stone-and-timber buildings, and the open-air
  ethnographic museum (Petit Monde / Maison Rosset). This was the explicit task emphasis.
- **water_sources_*** : fountains at Poutaz/Torgnon, no reliable spring on the climb,
  water at Triatel in season.
- **transport_*** : VITA buses up the Valtournenche to Torgnon; A5 → Châtillon → SR46 by car.
- **parking** : public parking at Torgnon village and Poutaz trailhead.
- **warnings_*** : steep concentrated gradient, stepped/rooty slippery surface, sunny slope.
- **waypoints** (3): Poutaz start (bivio), mid larch wood (panorama), Triatel arrival
  (panorama), with notes in all 4 languages and elevations/distances interpolated along
  the 1.35 km / +500 m profile.

## Derived / estimated fields
- **duration_hours: 1.5** — short distance but 500 m of pure ascent; ~1h up + margin.
- **fitness_level: 2** — short outing, but the sustained gradient keeps it off level 1.
- **calories_estimate: 600** — consistent with ~1.5 h of steep uphill hiking.
- **mobile_coverage: "partial"** — typical for a wooded mid-elevation slope near an
  inhabited valley; not field-verified.
- **tags**: `family-friendly`, `cultural`, `short`, `steep`.
- **updated_at**: set to 2026-06-01.

## Assumptions / caveats
- Triatel cultural detail (rascard, funghi di pietra, Petit Monde / Maison Rosset museum)
  is well-established heritage knowledge for Torgnon; not pulled from a project data file.
- The intermediate "larch wood" waypoint is descriptive/interpolated, not a surveyed point.
- `mobile_coverage`, `duration_hours`, `fitness_level`, `calories_estimate` are reasoned
  estimates, not measured values.

## Constraints respected
- No files under `src/`, `public/`, or `package.json` were modified. Project read only.
- Output written only to this `outputs/` folder: `02-s11.json` + `notes.md`.
- Output validated as parseable JSON; all `shortDescription_*` within the 280-char cap.
