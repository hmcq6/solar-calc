import { helper } from '@ember/component/helper';
import numeral from 'numeral';

export function formatValue([value, format, ...rest]) {
  return numeral(value).format(format);
}

export default helper(formatValue);
