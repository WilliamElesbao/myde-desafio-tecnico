import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.locale("pt-br");

export { dayjs };
