export type SpeciesKind = 'flora' | 'fauna';

/** Classe zoologica (navigazione livello 1) */
export type FaunaClass = 'mammal' | 'bird' | 'herpeto';

/** Gruppo pratico all'interno della classe */
export type FaunaGroup =
  | 'ungulate'
  | 'carnivore'
  | 'rodent'
  | 'raptor'
  | 'galliform'
  | 'alpine_bird'
  | 'forest_bird'
  | 'amphibian'
  | 'reptile';

export type FloraGroup = 'tree' | 'shrub' | 'herb';

/** Sotto-gruppo pratico / ecologico */
export type FloraSubgroup =
  | 'conifer'
  | 'broadleaf'
  | 'montane_shrub'
  | 'valley_shrub'
  | 'alpine_meadow'
  | 'rock'
  | 'wetland'
  | 'forest_floor';

export type DistributionZone = {
  name_it: string;
  name_en: string;
  center: [number, number];
  radiusKm: number;
};

export type SpeciesLink = {
  label_it: string;
  label_en: string;
  url: string;
};

/** Scheda descrittiva strutturata (stile naturalistico) */
export type SpeciesProfile = {
  overview_it: string;
  overview_en: string;
  identification_it: string;
  identification_en: string;
  ecology_it: string;
  ecology_en: string;
  inValle_it: string;
  inValle_en: string;
};

export type SpeciesBase = {
  id: string;
  kind: SpeciesKind;
  name_it: string;
  name_en: string;
  scientific: string;
  image: string;
  author: string;
  license: string;
  profile: SpeciesProfile;
  /** @deprecated — usare profile.overview */
  desc_it?: string;
  desc_en?: string;
  altitude: { min: number; max: number };
  zones: DistributionZone[];
  links: SpeciesLink[];
};

export type FloraSpecies = SpeciesBase & {
  kind: 'flora';
  floraGroup: FloraGroup;
  floraSubgroup: FloraSubgroup;
  plantType_it: string;
  plantType_en: string;
  soil_it: string;
  soil_en: string;
  leaves_it: string;
  leaves_en: string;
  flowers_it: string;
  flowers_en: string;
  bloom_it: string;
  bloom_en: string;
  tempRange_it: string;
  tempRange_en: string;
  humidity_it: string;
  humidity_en: string;
};

export type FaunaSpecies = SpeciesBase & {
  kind: 'fauna';
  faunaClass: FaunaClass;
  faunaGroup: FaunaGroup;
  diet_it: string;
  diet_en: string;
  habitat_it: string;
  habitat_en: string;
  activity_it: string;
  activity_en: string;
  status_it: string;
  status_en: string;
};

export type Species = FloraSpecies | FaunaSpecies;

export function isFlora(s: Species): s is FloraSpecies {
  return s.kind === 'flora';
}

export function isFauna(s: Species): s is FaunaSpecies {
  return s.kind === 'fauna';
}

export const FAUNA_CLASS_LABELS: Record<FaunaClass, { it: string; en: string }> = {
  mammal: { it: 'Mammiferi', en: 'Mammals' },
  bird: { it: 'Uccelli', en: 'Birds' },
  herpeto: { it: 'Anfibi e rettili', en: 'Amphibians & reptiles' },
};

export const FAUNA_GROUP_LABELS: Record<FaunaGroup, { it: string; en: string }> = {
  ungulate: { it: 'Ungulati', en: 'Ungulates' },
  carnivore: { it: 'Carnivori', en: 'Carnivores' },
  rodent: { it: 'Roditori e lepri', en: 'Rodents & hares' },
  raptor: { it: 'Rapaci', en: 'Raptors' },
  galliform: { it: 'Galliformi', en: 'Galliformes' },
  alpine_bird: { it: 'Uccelli di montagna', en: 'Mountain birds' },
  forest_bird: { it: 'Uccelli del bosco', en: 'Forest birds' },
  amphibian: { it: 'Anfibi', en: 'Amphibians' },
  reptile: { it: 'Rettili', en: 'Reptiles' },
};

export const FLORA_GROUP_LABELS: Record<FloraGroup, { it: string; en: string }> = {
  tree: { it: 'Alberi', en: 'Trees' },
  shrub: { it: 'Arbusti', en: 'Shrubs' },
  herb: { it: 'Erbe e fiori', en: 'Herbs & flowers' },
};

export const FLORA_SUBGROUP_LABELS: Record<FloraSubgroup, { it: string; en: string }> = {
  conifer: { it: 'Conifere', en: 'Conifers' },
  broadleaf: { it: 'Latifoglie', en: 'Broadleaved trees' },
  montane_shrub: { it: 'Arbusti di montagna', en: 'Montane shrubs' },
  valley_shrub: { it: 'Arbusti di valle', en: 'Valley shrubs' },
  alpine_meadow: { it: 'Prati alpini', en: 'Alpine meadows' },
  rock: { it: 'Rocce e ghiaioni', en: 'Rock & scree' },
  wetland: { it: 'Zone umide', en: 'Wetlands' },
  forest_floor: { it: 'Bosco e sottobosco', en: 'Forest floor' },
};

/** Gruppi fauna ammessi per classe */
export const FAUNA_GROUPS_BY_CLASS: Record<FaunaClass, FaunaGroup[]> = {
  mammal: ['ungulate', 'carnivore', 'rodent'],
  bird: ['raptor', 'galliform', 'alpine_bird', 'forest_bird'],
  herpeto: ['amphibian', 'reptile'],
};

export const FLORA_SUBGROUPS_BY_GROUP: Record<FloraGroup, FloraSubgroup[]> = {
  tree: ['conifer', 'broadleaf'],
  shrub: ['montane_shrub', 'valley_shrub'],
  herb: ['alpine_meadow', 'rock', 'wetland', 'forest_floor'],
};
