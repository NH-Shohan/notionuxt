import antfu from '@antfu/eslint-config'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default antfu({
  formatters: true,
  vue: true,
});