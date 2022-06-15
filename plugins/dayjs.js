import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear'
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(dayOfYear);
dayjs.extend(weekOfYear);
dayjs.extend(relativeTime);