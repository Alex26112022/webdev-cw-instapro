import { format } from 'https://cdn.jsdelivr.net/npm/date-fns@3/+esm';
import {
  enGB,
  eo,
  ru,
} from 'https://cdn.jsdelivr.net/npm/date-fns@3/locale/+esm';

const locales = { enGB, eo, ru };

export default function (date, formatStr = 'PP') {
  return format(date, formatStr, {
    locale: locales[window.__localeId__],
  });
}
