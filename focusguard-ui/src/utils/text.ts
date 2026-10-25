// "SUB_ADMIN" -> "Sub Admin", "REJECTED" -> "Rejected"
export function formatEnumLabel(
  value: string
) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}
