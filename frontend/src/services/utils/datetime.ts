import { Temporal } from "@js-temporal/polyfill";

export function timestamptzToTemporalZonedDateTime(
  timestamptz: string
): Temporal.ZonedDateTime {
  return Temporal.Instant.from(timestamptz).toZonedDateTimeISO(
    Temporal.Now.timeZone()
  );
}
