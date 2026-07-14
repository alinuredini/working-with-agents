import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveText, parseConfirm, parseSelect } from '../src/prompts.js';

test('resolveText returns input or default', () => {
  assert.equal(resolveText('hi', 'def'), 'hi');
  assert.equal(resolveText('   ', 'def'), 'def');
  assert.equal(resolveText('', 'def'), 'def');
});

test('parseConfirm parses y/n with default', () => {
  assert.equal(parseConfirm('y', false), true);
  assert.equal(parseConfirm('YES', false), true);
  assert.equal(parseConfirm('n', true), false);
  assert.equal(parseConfirm('', true), true);
  assert.equal(parseConfirm('', false), false);
});

test('parseSelect maps number to value, falls back to default', () => {
  const choices = [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }];
  assert.equal(parseSelect('2', choices, 0), 'b');
  assert.equal(parseSelect('', choices, 1), 'b');
  assert.equal(parseSelect('9', choices, 0), 'a'); // out of range → default
  assert.equal(parseSelect('x', choices, 1), 'b'); // NaN → default
});

import { parseMultiselect } from '../src/prompts.js';

test('parseMultiselect: numbers, all, none, empty, out-of-range', () => {
  const choices = [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }, { label: 'C', value: 'c' }];
  assert.deepEqual(parseMultiselect('1,3', choices, []), ['a', 'c']);
  assert.deepEqual(parseMultiselect('2 3', choices, []), ['b', 'c']);
  assert.deepEqual(parseMultiselect('', choices, ['b']), ['b']);        // empty → default
  assert.deepEqual(parseMultiselect('none', choices, ['b']), []);        // explicit none
  assert.deepEqual(parseMultiselect('all', choices, []), ['a', 'b', 'c']);
  assert.deepEqual(parseMultiselect('9,x', choices, ['a']), []);         // no valid indices → empty (explicit input)
});
