import test from 'ava'

import { formatWarnings } from './format-warnings.js'

test('simple', (t) => {
  const output = formatWarnings([
    { path: ['x'], error: new Error('does not exist') },
  ])
  t.is(
    output,
    'Warning: root.x does not exist at file:///home/admin/src/github.com/stayradiated/prism/dist/format-warnings.test.js:5:31',
  )
})

test('complex', (t) => {
  const output = formatWarnings([
    { path: ['a', 0, 'b', 1, 'c', 2], error: new Error('does not exist') },
  ])
  t.is(
    output,
    'Warning: root.a[0].b[1].c[2] does not exist at file:///home/admin/src/github.com/stayradiated/prism/dist/format-warnings.test.js:11:50',
  )
})
