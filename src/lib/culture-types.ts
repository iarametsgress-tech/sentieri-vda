import { z } from 'zod';

export const TownSchema = z.object({
  id: z.string(),
  name_it: z.string(),
  name_en: z.string(),
  name_fr: z.string(),
  name_de: z.string(),
  description_it: z.string(),
  description_en: z.string(),
  description_fr: z.string(),
  description_de: z.string(),
  official_url: z.string().url().optional(),
});

export type Town = z.infer<typeof TownSchema>;

export const ValleySchema = z.object({
  id: z.string(),
  name_it: z.string(),
  name_en: z.string(),
  name_fr: z.string(),
  name_de: z.string(),
  eyebrow_it: z.string(),
  eyebrow_en: z.string(),
  eyebrow_fr: z.string(),
  eyebrow_de: z.string(),
  description_it: z.string(),
  description_en: z.string(),
  description_fr: z.string(),
  description_de: z.string(),
  image: z.string(),
  image_credit: z.string().optional(),
  image_source: z.string().url().optional(),
  towns: z.array(TownSchema),
  trail_labels: z.array(z.string()),
  official_url: z.string().url().optional(),
  source: z.string(),
});

export type Valley = z.infer<typeof ValleySchema>;

export const TraditionSchema = z.object({
  id: z.string(),
  category: z.enum(['costumi', 'feste', 'musica', 'folklore', 'devozione']),
  title_it: z.string(),
  title_en: z.string(),
  title_fr: z.string(),
  title_de: z.string(),
  body_it: z.string(),
  body_en: z.string(),
  body_fr: z.string(),
  body_de: z.string(),
  image: z.string(),
  image_credit: z.string().optional(),
  image_source: z.string().url().optional(),
  official_url: z.string().url().optional(),
  source: z.string(),
});

export type Tradition = z.infer<typeof TraditionSchema>;

export const FoodWineItemSchema = z.object({
  id: z.string(),
  type: z.enum(['food', 'wine', 'cheese']),
  title_it: z.string(),
  title_en: z.string(),
  title_fr: z.string(),
  title_de: z.string(),
  body_it: z.string(),
  body_en: z.string(),
  body_fr: z.string(),
  body_de: z.string(),
  image: z.string(),
  image_credit: z.string().optional(),
  image_source: z.string().url().optional(),
  official_url: z.string().url().optional(),
  source: z.string(),
});

export type FoodWineItem = z.infer<typeof FoodWineItemSchema>;

export type CulturaSectionId = 'valli' | 'tradizioni' | 'cibo-vino';
