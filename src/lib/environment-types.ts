import { z } from 'zod';

export const PeakSchema = z.object({
  id: z.string(),
  name_it: z.string(),
  name_en: z.string(),
  elevation_m: z.number().int().positive(),
  massif_it: z.string(),
  massif_en: z.string(),
  is_4000: z.boolean(),
  on_trails: z.boolean().default(false),
  image: z.string(),
  description_it: z.string(),
  description_en: z.string(),
  wiki_it: z.string().url().optional(),
  wiki_en: z.string().url().optional(),
  source: z.string(),
});

export type Peak = z.infer<typeof PeakSchema>;

export type MassifGroup = {
  id: string;
  massif_it: string;
  massif_en: string;
  primary: Peak;
  secondaries: Peak[];
  peaks: Peak[];
};

export type PeakFilter = 'all' | '4000' | 'trails';

export const MassifOverviewSchema = z.object({
  id: z.string(),
  overview_it: z.string(),
  overview_en: z.string(),
  highlights_it: z.array(z.string()).optional(),
  highlights_en: z.array(z.string()).optional(),
});

export type MassifOverview = z.infer<typeof MassifOverviewSchema>;

export const EnvironmentStatSchema = z.object({
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label_it: z.string(),
  label_en: z.string(),
  source: z.string(),
});

export type EnvironmentStat = z.infer<typeof EnvironmentStatSchema>;

export const EnvironmentSectionSchema = z.object({
  id: z.string(),
  title_it: z.string(),
  title_en: z.string(),
  eyebrow_it: z.string(),
  eyebrow_en: z.string(),
  body_it: z.string(),
  body_en: z.string(),
  highlights_it: z.array(z.string()).optional(),
  highlights_en: z.array(z.string()).optional(),
  stats: z.array(EnvironmentStatSchema).optional(),
  image: z.string().optional(),
  image_alt_it: z.string().optional(),
  image_alt_en: z.string().optional(),
});

export type EnvironmentSection = z.infer<typeof EnvironmentSectionSchema>;

export type AmbienteSectionId = 'flora-fauna' | 'montagne' | 'geologia' | 'idrologia';
