import test from 'ava'

import Prism from './index'

/* property: value */

test('prism.value should match input value', (t) => {
  const p = new Prism({ a: 1 })
  t.deepEqual(p.value, { a: 1 })
})

/* property: path */

test('prism.path should default to []', (t) => {
  const p = new Prism({ a: 1 })
  t.deepEqual(p.path, [])
})

/* property: exists */

test('prism.exists should be true if value is not undefined', (t) => {
  const p = new Prism({ a: 1 })
  t.true(p.exists)
})

test('prism.exists should be true if value is null', (t) => {
  const p = new Prism(null)
  t.true(p.exists)
})

test('prism.exists should be false if value is undefined', (t) => {
  const p = new Prism(undefined)
  t.false(p.exists)
})

/* property: warnings */

test('prism.warnings should be empty by default', (t) => {
  const p = new Prism({})
  t.deepEqual(p.warnings, [])
})

test('prism should not warn on undefined values', (t) => {
  const p = new Prism(undefined)
  t.deepEqual(p.warnings, [])
})

/* method: get */

test('prism.get should return a new prism', (t) => {
  const p = new Prism({ a: 1 })
  const a = p.get('a')
  t.deepEqual(a.warnings, [])
  t.true(p instanceof Prism)
})

test('prism.get should have a value to equal to the key', (t) => {
  const p = new Prism({ a: 1 })
  const a = p.get('a')
  t.deepEqual(a.warnings, [])
  t.is(a.value, 1)
  t.true(a.exists)
})

test('prism.get should handle values that do not exist', (t) => {
  const p = new Prism({})
  const a = p.get('a')
  t.deepEqual(a.warnings, ['root.a: Value is undefined.'])
  t.is(a.value, undefined)
  t.false(a.exists)
})

test('prism.get should get a chain of keys', (t) => {
  const p = new Prism({ a: { b: { c: 1 } } })
  const a = p.get('a')
  const b = a.get('b')
  const c = b.get('c')
  t.deepEqual(c.warnings, [])
  t.is(c.value, 1)
  t.true(c.exists)
})

test('prism.get should handle a broken chain', (t) => {
  const p = new Prism({ a: { b: {} } })
  const c = p
    .get('a')
    .get('b')
    .get('c')
  t.deepEqual(c.warnings, ['root.a.b.c: Value is undefined.'])
  t.is(c.value, undefined)
  t.false(c.exists)
})

/* method: transform */

test('prism.transform should change the value', (t) => {
  const input = new Prism('hello')
  const output = input.transform(() => 'world')
  t.deepEqual(output.warnings, [])
  t.is(output.value, 'world')
})

test('prism.transform should have access to the prism', (t) => {
  const input = new Prism('hello world')
  const output = input.transform((p) => {
    return p.value.toUpperCase()
  })
  t.deepEqual(output.warnings, [])
  t.is(output.value, 'HELLO WORLD')
})
