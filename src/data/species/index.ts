import type {
  FaunaClass,
  FaunaGroup,
  FloraGroup,
  FloraSubgroup,
  Species,
} from '@/lib/species-types';
import { FAUNA_LIST } from './fauna-list';
import { FLORA_LIST } from './flora-list';

export const SPECIES: Species[] = [...FAUNA_LIST, ...FLORA_LIST];

export function getFauna() {
  return FAUNA_LIST;
}

export function getFlora(group?: FloraGroup, subgroup?: FloraSubgroup) {
  let list = FLORA_LIST;
  if (group) list = list.filter((s) => s.floraGroup === group);
  if (subgroup) list = list.filter((s) => s.floraSubgroup === subgroup);
  return list;
}

export function getSpeciesById(id: string): Species | undefined {
  return SPECIES.find((s) => s.id === id);
}

export function getFaunaByClassAndGroup(faunaClass?: FaunaClass, faunaGroup?: FaunaGroup) {
  let list = FAUNA_LIST;
  if (faunaClass) list = list.filter((s) => s.faunaClass === faunaClass);
  if (faunaGroup) list = list.filter((s) => s.faunaGroup === faunaGroup);
  return list;
}
