export function toDateString(date: Date) {
  return `${date.toJSON().substring(0, 10)}` as unknown as Date
}
