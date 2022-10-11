import { ExtendedLocalStorage } from "./localstorage-json";
import {
  migrateToLatest,
  type LocalStorageDatabase,
} from "./localstorage-migrations";

const storage = new ExtendedLocalStorage<LocalStorageDatabase>();

const rawData = storage.readAll();
const data = migrateToLatest(
  rawData.version !== undefined ? (rawData as any) : { version: 0 }
);
storage.writeAll(data);

export function storageRef<Key extends keyof LocalStorageDatabase>(key: Key) {
  return computed<LocalStorageDatabase[Key]>({
    get() {
      return data[key];
    },
    set(value) {
      data[key] = value;
      storage.write(key, value);
    },
  });
}
