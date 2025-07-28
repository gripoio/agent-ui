export function applyImportant(classes: string) {
  return classes
    .split(" ")
    .map(cls => cls.startsWith("!") ? cls : `!${cls}`)
    .join(" ");
}
