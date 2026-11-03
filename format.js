import { formatDistanceToNow } from 'https://cdn.jsdelivr.net/npm/date-fns@3/+esm';
import {
  enGB,
  eo,
  ru,
} from 'https://cdn.jsdelivr.net/npm/date-fns@3/locale/+esm';

const locales = { enGB, eo, ru };

export default function (date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: locales[window.__localeId__],
  });
}
