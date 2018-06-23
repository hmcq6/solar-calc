import { helper } from '@ember/component/helper';
import numeral from 'numeral';

export default helper(
  ([value, format, ..._rest]) => numeral(value).format(format)
);
