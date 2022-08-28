import { Temporal } from "@js-temporal/polyfill";

export function timestamptzToTemporalZonedDateTime(
  timestamptz: string
): Temporal.ZonedDateTime {
  return Temporal.Instant.from(timestamptz).toZonedDateTimeISO(
    Temporal.Now.timeZone()
  );
}

export function dateXHoursAgo(x: number) {
  return Temporal.Now.zonedDateTimeISO(Temporal.Now.timeZone()).subtract(
    new Temporal.Duration(0, 0, 0, 0, x)
  );
}
