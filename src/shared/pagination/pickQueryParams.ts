export const pickQueryParams = <
  T extends Record<string, unknown>,
  K extends keyof T
>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalObject: Partial<T> = {};

  for (const key of keys) {
    const lowerCase = String(key).toLowerCase();

    if (obj) {
      const isKeyExist = Object.keys(obj).find(
        (key: string) => key.toLowerCase() === lowerCase
      );

      if (isKeyExist) {
        finalObject[key] = obj[key];
      }
    }
  }

  return finalObject;
};
