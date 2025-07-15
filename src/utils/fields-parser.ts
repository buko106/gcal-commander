export function parseFields(fieldsString?: string | undefined): string[] | undefined {
  if (!fieldsString) {
    return undefined;
  }

  return fieldsString
    .split(',')
    .map((field) => field.trim())
    .filter((field) => field !== '');
}
