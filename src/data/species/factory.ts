import type {
  DistributionZone,
  FaunaClass,
  FaunaGroup,
  FaunaSpecies,
  FloraGroup,
  FloraSpecies,
  FloraSubgroup,
  SpeciesProfile,
} from '@/lib/species-types';
import { Z, faunaLinks, floraLinks } from './helpers';

type ZoneKey = keyof typeof Z;

export function profile(
  it: { overview: string; identification: string; ecology: string; inValle: string },
  en: { overview: string; identification: string; ecology: string; inValle: string }
): SpeciesProfile {
  return {
    overview_it: it.overview,
    overview_en: en.overview,
    identification_it: it.identification,
    identification_en: en.identification,
    ecology_it: it.ecology,
    ecology_en: en.ecology,
    inValle_it: it.inValle,
    inValle_en: en.inValle,
  };
}

function zones(keys: ZoneKey[]): DistributionZone[] {
  return keys.map((k) => Z[k]());
}

const img = (id: string) => `/species/${id}.jpg`;

type FaunaInput = {
  id: string;
  faunaClass: FaunaClass;
  faunaGroup: FaunaGroup;
  name_it: string;
  name_en: string;
  scientific: string;
  author?: string;
  license?: string;
  altitude: [number, number];
  zoneKeys: ZoneKey[];
  wikiIt: string;
  wikiEn: string;
  extraLinks?: Parameters<typeof faunaLinks>[2];
  diet_it: string;
  diet_en: string;
  habitat_it: string;
  habitat_en: string;
  activity_it: string;
  activity_en: string;
  status_it: string;
  status_en: string;
  profile: SpeciesProfile;
};

export function fauna(d: FaunaInput): FaunaSpecies {
  return {
    id: d.id,
    kind: 'fauna',
    faunaClass: d.faunaClass,
    faunaGroup: d.faunaGroup,
    name_it: d.name_it,
    name_en: d.name_en,
    scientific: d.scientific,
    image: img(d.id),
    author: d.author ?? 'Wikimedia Commons',
    license: d.license ?? 'CC BY-SA',
    profile: d.profile,
    desc_it: d.profile.overview_it,
    desc_en: d.profile.overview_en,
    altitude: { min: d.altitude[0], max: d.altitude[1] },
    zones: zones(d.zoneKeys),
    links: faunaLinks(d.wikiIt, d.wikiEn, d.extraLinks),
    diet_it: d.diet_it,
    diet_en: d.diet_en,
    habitat_it: d.habitat_it,
    habitat_en: d.habitat_en,
    activity_it: d.activity_it,
    activity_en: d.activity_en,
    status_it: d.status_it,
    status_en: d.status_en,
  };
}

type FloraInput = {
  id: string;
  floraGroup: FloraGroup;
  floraSubgroup: FloraSubgroup;
  name_it: string;
  name_en: string;
  scientific: string;
  author?: string;
  license?: string;
  altitude: [number, number];
  zoneKeys: ZoneKey[];
  wikiIt: string;
  wikiEn: string;
  extraLinks?: Parameters<typeof floraLinks>[2];
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
  profile: SpeciesProfile;
};

export function flora(d: FloraInput): FloraSpecies {
  return {
    id: d.id,
    kind: 'flora',
    floraGroup: d.floraGroup,
    floraSubgroup: d.floraSubgroup,
    name_it: d.name_it,
    name_en: d.name_en,
    scientific: d.scientific,
    image: img(d.id),
    author: d.author ?? 'Wikimedia Commons',
    license: d.license ?? 'CC BY-SA',
    profile: d.profile,
    desc_it: d.profile.overview_it,
    desc_en: d.profile.overview_en,
    altitude: { min: d.altitude[0], max: d.altitude[1] },
    zones: zones(d.zoneKeys),
    links: floraLinks(d.wikiIt, d.wikiEn, d.extraLinks),
    plantType_it: d.plantType_it,
    plantType_en: d.plantType_en,
    soil_it: d.soil_it,
    soil_en: d.soil_en,
    leaves_it: d.leaves_it,
    leaves_en: d.leaves_en,
    flowers_it: d.flowers_it,
    flowers_en: d.flowers_en,
    bloom_it: d.bloom_it,
    bloom_en: d.bloom_en,
    tempRange_it: d.tempRange_it,
    tempRange_en: d.tempRange_en,
    humidity_it: d.humidity_it,
    humidity_en: d.humidity_en,
  };
}
