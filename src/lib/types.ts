import { z } from 'zod';

export const DifficultySchema = z.enum(['T', 'E', 'EE', 'EEA', 'A']);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const SeasonSchema = z.enum(['spring', 'summer', 'autumn', 'winter', 'all-year']);

export const CoordsSchema = z.object({
  lat: z.number().min(45).max(46),  // Valle d'Aosta bounds
  lng: z.number().min(6.5).max(8),
});
export type Coords = z.infer<typeof CoordsSchema>;

export const TrailSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name_it: z.string(),
  name_en: z.string(),
  shortDescription_it: z.string().max(280),
  shortDescription_en: z.string().max(280),
  description_it: z.string(),
  description_en: z.string(),

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
  hero_image: z.string(),             // path /images/... o https URL
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
});

export type Trail = z.infer<typeof TrailSchema>;

export const RefugeSchema = z.object({
  slug: z.string(),
  name: z.string(),
  type: z.enum(['rifugio', 'bivacco', 'capanna']),
  coords: CoordsSchema,
  elevation_m: z.number(),
  beds: z.number().optional(),
  open_period: z.string().optional(),       // "giugno-settembre"
  phone: z.string().optional(),
  website: z.string().url().optional(),
  booking_affiliate_url: z.string().url().optional(),
  description_it: z.string(),
  description_en: z.string(),
  image: z.string().optional(),
  trails: z.array(z.string()).default([]),  // slug sentieri di accesso
});

export type Refuge = z.infer<typeof RefugeSchema>;
