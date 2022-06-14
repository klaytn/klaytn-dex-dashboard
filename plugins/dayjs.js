import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(dayOfYear);
dayjs.extend(weekOfYear);