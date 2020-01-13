import test from 'ava'

import { printWarnings } from './print-warnings'

test('simple', (t) => {
  printWarnings([{ path: ['x'], message: 'does not exist' }])
  t.pass()
})
