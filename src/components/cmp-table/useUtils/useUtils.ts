export default function useUtils() {
  const valueOrDefault = function <T>(value: unknown, defaultValue: T) {
    return value ?? defaultValue;
  };

  return {
    valueOrDefault,
  };
}
