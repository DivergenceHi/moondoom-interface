import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function getNextUTC8() {
  const now = dayjs().utc();

  const today8am = now.startOf('day').hour(8);

  if (now.isAfter(today8am)) {
    return today8am.add(1, 'day');
  }

  return today8am;
}
