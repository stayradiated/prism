import test from 'ava'

import Prism from './index'
import { asValue, defaultTo } from './transformers'

/* asValue */

test('prism.transform(asValue(...)) should change the value', (t) => {
  const input = new Prism('hello world')
  const output = input.transform(
    asValue((value: string) => value.toUpperCase()),
  )
  t.deepEqual(output.warnings, [])
  t.is(output.value, 'HELLO WORLD')
})

/* defaultTo */

test('prism.transform(defaultTo(...)) should use the default value if the property does not exist', (t) => {
  const input = new Prism({})
  const output = input
    .get('x', { quiet: true })
    .transform(defaultTo('hello world'))
  t.deepEqual(output.warnings, [])
  t.is(output.value, 'hello world')
})

test('prism.transform(defaultTo(...)) should use the default value if the value is UNDEFINED', (t) => {
  const input = new Prism({ x: undefined })
  const output = input
    .get('x', { quiet: true })
    .transform(defaultTo('hello world'))
  t.deepEqual(output.warnings, [])
  t.is(output.value, 'hello world')
})

test('prism.transform(defaultTo(...)) should NOT use the default value', (t) => {
  const input = new Prism({ x: 'value' })
  const output = input
    .get('x', { quiet: true })
    .transform(defaultTo('hello world'))
  t.deepEqual(output.warnings, [])
  t.is(output.value, 'value')
})

test('prism.transform(defaultTo(...)) should NOT use the default value if the value is NULL', (t) => {
  const input = new Prism({ x: null })
  const output = input
    .get('x', { quiet: true })
    .transform(defaultTo('hello world'))
  t.deepEqual(output.warnings, [])
  t.is(output.value, null)
})
