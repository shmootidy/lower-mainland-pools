import { DateTime } from 'luxon'

export function getVancouverNow(): DateTime<boolean> {
  return DateTime.now().setZone('America/Vancouver')
}
