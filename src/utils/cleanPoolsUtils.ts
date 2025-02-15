import {
  faCheck,
  faDragon,
  faFaceFlushed,
  faFaceGrimace,
  faFaceGrinHearts,
  faFaceMeh,
  faFaceSmile,
  faGhost,
  faHourglassHalf,
  faSkull,
  faSoap,
  faX,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { DateTime } from 'luxon'
import { ReasonForClosure } from '../Hooks/useGetPoolsAndClosures'

interface IconAndColorMap {
  [key: string]: {
    icon: IconDefinition
    color: string
  }
}

export function getPoolStatusIcon(
  poolLastCleanedDate: string | null,
  reasonForClosure: ReasonForClosure,
  now: DateTime<boolean>
) {
  if (!poolLastCleanedDate) {
    return ICON_AND_COLOR_MAP['unknown']
  }

  if (reasonForClosure === 'unknown') {
    return ICON_AND_COLOR_MAP['mystery']
  }

  const poolReopenDate = DateTime.fromSQL(poolLastCleanedDate)
  const poolIsBeingCleaned = poolReopenDate > now

  if (reasonForClosure === 'annual maintenance' && poolIsBeingCleaned) {
    return ICON_AND_COLOR_MAP['cleaning']
  }

  const monthsSinceCleaning = poolReopenDate
    .diff(now, 'months')
    .toObject().months

  if (!monthsSinceCleaning) {
    return ICON_AND_COLOR_MAP['undefined']
  }
  const key = Math.ceil(monthsSinceCleaning / 2) * 2

  return ICON_AND_COLOR_MAP[`${key}`] ?? ICON_AND_COLOR_MAP['undefined']
}

const ICON_AND_COLOR_MAP: IconAndColorMap = {
  unknown: {
    icon: faHourglassHalf,
    color: '#fcfcfc33',
  },
  cleaning: {
    icon: faSoap,
    color: '#2e3ae6',
  },
  '2': {
    icon: faFaceGrinHearts,
    color: '#5bc130',
  },
  '4': {
    icon: faFaceSmile,
    color: '#5bc130',
  },
  '6': {
    icon: faFaceMeh,
    color: '#FFE599',
  },
  '8': {
    icon: faFaceFlushed,
    color: '#f6b26a',
  },
  '10': {
    icon: faFaceGrimace,
    color: '#E06666',
  },
  '12': {
    icon: faSkull,
    color: '#d93838',
  },
  undefined: {
    icon: faGhost,
    color: '#fcfcfc',
  },
  mystery: {
    icon: faDragon,
    color: '#d93838',
  },
}

export const OPEN_CLOSED_ICON_MAP: IconAndColorMap = {
  closed: {
    icon: faX,
    color: '#d93838',
  },
  open: {
    icon: faCheck,
    color: '#5bc130',
  },
}
