/**
 * Returns a string concatination of the keys whose values are truthy
 * @param {object} styleObj
 */
export function styles(styleObj: Record<string, boolean>) {
  const result = [];
  for (const style in styleObj) {
    if (style && styleObj[style]) {
      result.push(style);
    }
  }
  return result.join(" ");
}

export function last<T>(args: T[]): T | undefined {
  return args[args.length - 1];
}