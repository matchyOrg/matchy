function stringifyReplacer(key: string, value: any) {
  // see: https://stackoverflow.com/a/73155667/3492994
  if (typeof value === "object" && value !== null) {
    if (value instanceof Map) {
      return {
        _meta: { type: "map" },
        value: Array.from(value.entries()),
      };
    } else if (value instanceof Set) {
      return {
        _meta: { type: "set" },
        value: Array.from(value.values()),
      };
    } else if ("_meta" in value) {
      // escape "_meta" properties
      return {
        ...value,
        _meta: {
          type: "escaped-meta",
          value: value["_meta"],
        },
      };
    }
  }
  return value;
}

function parseReviver(key: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if ("_meta" in value) {
      if (value._meta.type === "map") {
        return new Map(value.value);
      } else if (value._meta.type === "set") {
        return new Set(value.value);
      } else if (value._meta.type === "escaped-meta") {
        return {
          ...value,
          _meta: value._meta.value,
        };
      } else {
        console.warn("Unexpected meta", value._meta);
      }
    }
  }
  return value;
}

const LocalStorageKey = "matchy.";
export class ExtendedLocalStorage<T extends Record<string, any>> {
  readAll(): Partial<T> {
    const obj = {} as { [key: string]: any };

    const len = localStorage.length;
    for (let i = 0; i < len; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(LocalStorageKey)) continue;

      const value = localStorage.getItem(key);
      if (value === null) continue;
      obj[key] = JSON.parse(value, parseReviver);
    }

    return obj as Partial<T>;
  }

  write<Key extends keyof T & string>(key: Key, value: T[Key]) {
    localStorage.setItem(
      LocalStorageKey + key,
      JSON.stringify(value, stringifyReplacer)
    );
  }

  writeAll(data: T) {
    Object.entries(data).forEach(([key, value]) => {
      this.write(key, value);
    });
  }
}
