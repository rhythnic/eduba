/**
 * Returns a string concatination of the keys whose values are truthy
 * @param {object} styleObj
 */
export function styles(styleObj) {
  let result = [];
  for (const style in styleObj) {
    if (style && styleObj[style]) {
      result.push(style);
    }
  }
  return result.join(" ");
}
