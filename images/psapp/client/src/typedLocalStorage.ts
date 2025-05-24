import {UserProgressDTO, UserProgressVideoDTO} from '../../common/types';

type LocalStorageSchema = {
  progress: UserProgressDTO,
  progressVideo: UserProgressVideoDTO,
};
export let typedLocalStorage = {
  setJson: <K extends keyof LocalStorageSchema>(
    key: K, value: LocalStorageSchema[K],
  ): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getJson: <K extends keyof LocalStorageSchema>(
    key: K
  ): LocalStorageSchema[K] | null => {
    let value = localStorage.getItem(key);
    if (value === null) {
      return value;
    }
    return JSON.parse(value) as LocalStorageSchema[K];
  },
  removeJson: <K extends keyof LocalStorageSchema>(key: K): void => {
    localStorage.removeItem(key);
  },
};
