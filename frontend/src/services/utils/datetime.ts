import { Temporal } from "@js-temporal/polyfill";

export type IsoTimestampString = string;

export function timestampToInstant(timestamp: IsoTimestampString) {
  return Temporal.Instant.from(timestamp);
}

export function getUserTimeZone() {
  return Temporal.Now.timeZone();
}

export function instantToZonedDateTime(instant: Temporal.Instant) {
  return instant.toZonedDateTimeISO(Temporal.Now.timeZone());
}
