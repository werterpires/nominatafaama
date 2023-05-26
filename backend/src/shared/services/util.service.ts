export function toDateString(date: Date | null) {
  if (date) {
    return `${date?.toJSON().substring(0, 10)}` as unknown as Date
  } else {
    return null as unknown as Date
  }
}
