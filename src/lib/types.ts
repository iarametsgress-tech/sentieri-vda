import { z } from 'zod';

export const DifficultySchema = z.enum(['T', 'E', 'EE', 'EEA', 'A']);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const SeasonSchema = z.enum(['spring', 'summer', 'autumn', 'winter', 'all-year']);

export const CoordsSchema = z.object({
  // Arco alpino nord-occidentale: include VdA e le tappe estere dei tour
  // (Alta Savoia, Vallese, Tarentaise, Piemonte).
  lat: z.number().min(45.2).max(46.4),
  lng: z.number().min(6.4).max(8.2),
});
export type Coords = z.infer<typeof CoordsSchema>;

export const WaypointTypeSchema = z.enum([
  'col',
  'rifugio',
  'bivacco',
  'lago',
  'panorama',
  'fonte-acqua',
  'bivio',
]);
export type WaypointType = z.infer<typeof WaypointTypeSchema>;

export const WaypointSchema = z.object({
  name: z.string(),
  elevation_m: z.number(),
  distance_from_start_km: z.number().nonnegative(),
  type: WaypointTypeSchema,
  note_it: z.string().optional(),
  note_en: z.string().optional(),
  note_fr: z.string().optional(),
  note_de: z.string().optional(),
});
export type Waypoint = z.infer<typeof WaypointSchema>;

export const NearbyPeakSchema = z.object({
  name: z.string(),
  elevation_m: z.number(),
  distance_km: z.number().nonnegative(),
});
export type NearbyPeak = z.infer<typeof NearbyPeakSchema>;

export const MobileCoverageSchema = z.enum(['good', 'partial', 'none']);
export type MobileCoverage = z.infer<typeof MobileCoverageSchema>;

export const FitnessLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export type FitnessLevel = z.infer<typeof FitnessLevelSchema>;

export const TrailConditionStatusSchema = z.enum(['open', 'caution', 'closed']);
export type TrailConditionStatus = z.infer<typeof TrailConditionStatusSchema>;

export const TrailConditionsSchema = z.object({
  status: TrailConditionStatusSchema,
  note_it: z.string(),
  note_en: z.string(),
  note_fr: z.string(),
  note_de: z.string(),
  updated_at: z.string(),
});
export type TrailConditions = z.infer<typeof TrailConditionsSchema>;

export const TrailSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name_it: z.string(),
  name_en: z.string(),
  name_fr: z.string(),
  name_de: z.string(),
  shortDescription_it: z.string().max(280),
  shortDescription_en: z.string().max(280),
  shortDescription_fr: z.string().max(280),
  shortDescription_de: z.string().max(280),
  description_it: z.string(),
  description_en: z.string(),
  description_fr: z.string(),
  description_de: z.string(),

  distance_km: z.number().positive(),
  elevation_gain_m: z.number().nonnegative(),
  elevation_loss_m: z.number().nonnegative(),
  duration_hours: z.number().positive(),
  difficulty: DifficultySchema,
  season: z.array(SeasonSchema),

  start: z.object({
    name: z.string(),
    coords: CoordsSchema,
    elevation_m: z.number(),
  }),
  end: z.object({
    name: z.string(),
    coords: CoordsSchema,
    elevation_m: z.number(),
  }),

  valley: z.string(),                 // es. "Valpelline", "Val di Cogne"
  municipalities: z.array(z.string()),

  gpx_url: z.string().url().optional(),
  gpx_path: z.string().regex(/^\/gpx\/.+\.gpx$/).nullable().optional(),
  is_transfer_stage: z.boolean().optional(),  // tappa di trasferimento senza traccia continua
  enriched: z.boolean().optional(),
  image_credit: z.string().optional(),
  image_source: z.string().url().optional(),
  hero_image: z.string(),             // path /images/... o https URL
  image: z.string(),                  // card thumbnail — path /trails/...
  gallery: z.array(z.string()).default([]),

  refuges: z.array(z.string()).default([]),  // slug rifugi correlati
  flora: z.array(z.string()).default([]),    // slug specie flora
  fauna: z.array(z.string()).default([]),    // slug specie fauna

  tags: z.array(z.string()).default([]),     // 'alta-via-1', 'family-friendly', 'glacier', ...

  source: z.object({
    name: z.string(),                        // es. "Catasto Sentieri Regione VdA"
    url: z.string().url(),
    license: z.string(),                     // es. "Open data DGR 899/2014"
  }),

  updated_at: z.string(),                    // ISO date

  /** Condizioni attuali del sentiero — compilato manualmente, mai generato automaticamente */
  conditions: TrailConditionsSchema.optional(),

  // ── Arricchimento scientifico / pratico ──
  waypoints: z.array(WaypointSchema).optional(),
  geology_it: z.string().optional(),
  geology_en: z.string().optional(),
  geology_fr: z.string().optional(),
  geology_de: z.string().optional(),
  water_sources_it: z.string().optional(),
  water_sources_en: z.string().optional(),
  water_sources_fr: z.string().optional(),
  water_sources_de: z.string().optional(),
  transport_it: z.string().optional(),
  transport_en: z.string().optional(),
  transport_fr: z.string().optional(),
  transport_de: z.string().optional(),
  parking: z.string().optional(),
  mobile_coverage: MobileCoverageSchema,
  best_months: z.array(z.number().min(1).max(12)),
  warnings_it: z.array(z.string()).optional(),
  warnings_en: z.array(z.string()).optional(),
  warnings_fr: z.array(z.string()).optional(),
  warnings_de: z.array(z.string()).optional(),
  nearby_peaks: z.array(NearbyPeakSchema).optional(),
  cultural_notes_it: z.string().optional(),
  cultural_notes_en: z.string().optional(),
  cultural_notes_fr: z.string().optional(),
  cultural_notes_de: z.string().optional(),
  fitness_level: FitnessLevelSchema,
  calories_estimate: z.number().positive().optional(),
});

export type Trail = z.infer<typeof TrailSchema>;

/** Sottoinsieme di Trail per il catalogo /sentieri (card + filtri, senza payload pesante). */
export type BrowseTrailSummary = Pick<
  Trail,
  | 'slug'
  | 'name_it'
  | 'name_en'
  | 'name_fr'
  | 'name_de'
  | 'shortDescription_it'
  | 'shortDescription_en'
  | 'shortDescription_fr'
  | 'shortDescription_de'
  | 'difficulty'
  | 'distance_km'
  | 'elevation_gain_m'
  | 'duration_hours'
  | 'valley'
  | 'image'
  | 'hero_image'
  | 'tags'
  | 'start'
  | 'end'
>;

/**
 * Scheda sentiero incompleta generata dal Catasto Sentieri (SCT).
 * Stessa struttura di Trail ma con campi editoriali vuoti/null finché non curati.
 */
export const TrailSkeletonSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** Codice ufficiale SCT (es. `01_S1`) — usato per deduplicazione con trails.json */
  sct_code: z.string(),
  name_it: z.string(),
  name_en: z.string(),
  name_fr: z.string(),
  name_de: z.string(),
  shortDescription_it: z.string().max(280),
  shortDescription_en: z.string().max(280),
  shortDescription_fr: z.string().max(280),
  shortDescription_de: z.string().max(280),
  description_it: z.string(),
  description_en: z.string(),
  description_fr: z.string(),
  description_de: z.string(),

  distance_km: z.number().positive().nullable(),
  elevation_gain_m: z.number().nonnegative().nullable(),
  elevation_loss_m: z.number().nonnegative().nullable(),
  duration_hours: z.number().positive().nullable(),
  difficulty: DifficultySchema.nullable(),
  season: z.array(SeasonSchema).default([]),

  start: z
    .object({
      name: z.string(),
      coords: CoordsSchema,
      elevation_m: z.number(),
    })
    .nullable(),
  end: z
    .object({
      name: z.string(),
      coords: CoordsSchema,
      elevation_m: z.number(),
    })
    .nullable(),

  valley: z.string(),
  municipalities: z.array(z.string()),

  gpx_url: z.string().url().optional(),
  gpx_path: z.string().regex(/^\/gpx\/.+\.gpx$/).nullable().optional(),
  is_transfer_stage: z.boolean().optional(),
  /** Scheda scheletro arricchita (GPX + valle + descrizione + foto verificata) → indicizzabile */
  enriched: z.boolean().optional(),
  image_credit: z.string().optional(),
  image_source: z.string().url().optional(),
  hero_image: z.string(),
  image: z.string(),
  gallery: z.array(z.string()).default([]),

  refuges: z.array(z.string()).default([]),
  flora: z.array(z.string()).default([]),
  fauna: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  source: z.object({
    name: z.string(),
    url: z.string().url(),
    license: z.string(),
  }),

  updated_at: z.string(),

  waypoints: z.array(WaypointSchema).optional(),
  geology_it: z.string().optional(),
  geology_en: z.string().optional(),
  geology_fr: z.string().optional(),
  geology_de: z.string().optional(),
  water_sources_it: z.string().optional(),
  water_sources_en: z.string().optional(),
  water_sources_fr: z.string().optional(),
  water_sources_de: z.string().optional(),
  transport_it: z.string().optional(),
  transport_en: z.string().optional(),
  transport_fr: z.string().optional(),
  transport_de: z.string().optional(),
  parking: z.string().optional(),
  mobile_coverage: MobileCoverageSchema.nullable(),
  best_months: z.array(z.number().min(1).max(12)).nullable(),
  warnings_it: z.array(z.string()).optional(),
  warnings_en: z.array(z.string()).optional(),
  warnings_fr: z.array(z.string()).optional(),
  warnings_de: z.array(z.string()).optional(),
  nearby_peaks: z.array(NearbyPeakSchema).optional(),
  cultural_notes_it: z.string().optional(),
  cultural_notes_en: z.string().optional(),
  cultural_notes_fr: z.string().optional(),
  cultural_notes_de: z.string().optional(),
  fitness_level: FitnessLevelSchema.nullable(),
  calories_estimate: z.number().positive().optional(),
});

export type TrailSkeleton = z.infer<typeof TrailSkeletonSchema>;

export const RefugeImageSchema = z.object({
  src: z.string(),
  alt_it: z.string(),
  alt_en: z.string(),
  alt_fr: z.string(),
  alt_de: z.string(),
  credit: z.string().optional().nullable(),
});

export const RefugeSchema = z.object({
  slug: z.string(),
  name_it: z.string(),
  name_en: z.string(),
  name_fr: z.string(),
  name_de: z.string(),
  type: z.enum(['rifugio', 'bivacco', 'capanna']),
  coords: CoordsSchema,
  elevation_m: z.number(),
  valley_it: z.string(),
  valley_en: z.string(),
  valley_fr: z.string(),
  valley_de: z.string(),
  beds: z.number().optional().nullable(),
  open_period_it: z.string().optional().nullable(),
  open_period_en: z.string().optional().nullable(),
  open_period_fr: z.string().optional().nullable(),
  open_period_de: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  booking_url: z.string().url().optional().nullable(),
  instagram: z.string().url().optional().nullable(),
  facebook: z.string().url().optional().nullable(),
  manager_it: z.string().optional().nullable(),
  manager_en: z.string().optional().nullable(),
  manager_fr: z.string().optional().nullable(),
  manager_de: z.string().optional().nullable(),
  description_it: z.string(),
  description_en: z.string(),
  description_fr: z.string(),
  description_de: z.string(),
  history_it: z.string().optional().nullable(),
  history_en: z.string().optional().nullable(),
  history_fr: z.string().optional().nullable(),
  history_de: z.string().optional().nullable(),
  food_it: z.string().optional().nullable(),
  food_en: z.string().optional().nullable(),
  food_fr: z.string().optional().nullable(),
  food_de: z.string().optional().nullable(),
  costs_it: z.string().optional().nullable(),
  costs_en: z.string().optional().nullable(),
  costs_fr: z.string().optional().nullable(),
  costs_de: z.string().optional().nullable(),
  images: z.array(RefugeImageSchema).default([]),
  trails: z.array(z.string()).default([]),
  source: z.string().optional().nullable(),
});

export type Refuge = z.infer<typeof RefugeSchema>;
export type RefugeImage = z.infer<typeof RefugeImageSchema>;
