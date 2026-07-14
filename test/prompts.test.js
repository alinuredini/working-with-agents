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
