import test from 'ava'

import { printWarnings } from './print-warnings'

test('simple', (t) => {
  printWarnings([{ path: ['x'], error: new Error('does not exist') }])
  t.pass()
})

test('complex', (t) => {
  printWarnings([
    { path: ['a', 0, 'b', 1, 'c', 2], error: new Error('does not exist') },
  ])
  t.pass()
})

test('with stack', (t) => {
  printWarnings([
    {
      path: ['a', 0, 'b', 1, 'c', 2],
      error: new Error('does not exist'),
    },
  ])
  t.pass()
})
