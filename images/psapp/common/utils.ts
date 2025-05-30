import { ModuleType } from './types';

export function isModuleForAdults(moduleType: ModuleType): boolean {
  return moduleType === ModuleType.CHILD_DELEGATED || 
         moduleType === ModuleType.ADULT_OWNED;
}