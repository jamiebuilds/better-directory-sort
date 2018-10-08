// @flow
const test = require('ava');
const betterDirectorySort = require('./');

test('directories before files', t => {
  t.deepEqual([
    { name: 'a', isDirectory: false },
    { name: 'b', isDirectory: true },
  ].sort(betterDirectorySort), [
    { name: 'b', isDirectory: true },
    { name: 'a', isDirectory: false },
  ]);
});

test('directory names sort', t => {
  t.deepEqual([
    { name: 'b', isDirectory: true },
    { name: 'c', isDirectory: true },
    { name: 'a', isDirectory: true },
  ].sort(betterDirectorySort), [
    { name: 'a', isDirectory: true },
    { name: 'b', isDirectory: true },
    { name: 'c', isDirectory: true },
  ]);
});

test('file names sort', t => {
  t.deepEqual([
    { name: 'b', isDirectory: false },
    { name: 'c', isDirectory: false },
    { name: 'a', isDirectory: false },
  ].sort(betterDirectorySort), [
    { name: 'a', isDirectory: false },
    { name: 'b', isDirectory: false },
    { name: 'c', isDirectory: false },
  ]);
});

test('fewer extensions first', t => {
  t.deepEqual([
    { name: 'a.a', isDirectory: false },
    { name: 'a.a.a', isDirectory: false },
    { name: 'a', isDirectory: false },
  ].sort(betterDirectorySort), [
    { name: 'a', isDirectory: false },
    { name: 'a.a', isDirectory: false },
    { name: 'a.a.a', isDirectory: false },
  ]);
});

test('extensions sorting', t => {
  t.deepEqual([
    { name: 'a.b', isDirectory: false },
    { name: 'a.c', isDirectory: false },
    { name: 'a.a', isDirectory: false },
  ].sort(betterDirectorySort), [
    { name: 'a.a', isDirectory: false },
    { name: 'a.b', isDirectory: false },
    { name: 'a.c', isDirectory: false },
  ]);
});

test('middle extensions sorting', t => {
  t.deepEqual([
    { name: 'a.b.a', isDirectory: false },
    { name: 'a.c.a', isDirectory: false },
    { name: 'a.a.a', isDirectory: false },
  ].sort(betterDirectorySort), [
    { name: 'a.a.a', isDirectory: false },
    { name: 'a.b.a', isDirectory: false },
    { name: 'a.c.a', isDirectory: false },
  ]);
});

test('dotfiles first', t => {
  t.deepEqual([
    { name: '.b', isDirectory: false },
    { name: 'a', isDirectory: false },
  ].sort(betterDirectorySort), [
    { name: '.b', isDirectory: false },
    { name: 'a', isDirectory: false },
  ]);
});

test('empty strings should come first i guess', t => {
  t.deepEqual([
    { name: '', isDirectory: false },
    { name: 'a', isDirectory: false },
  ].sort(betterDirectorySort), [
    { name: '', isDirectory: false },
    { name: 'a', isDirectory: false },
  ]);
});

test('real world expectations', t => {
  t.deepEqual([
    { name: 'utils', isDirectory: true },
    { name: 'utils.i18n', isDirectory: true },
    { name: 'utils.i18n.langs', isDirectory: true },
    { name: '.gitignore', isDirectory: false },
    { name: 'SettingsForm.tsx', isDirectory: false },
    { name: 'SettingsForm.default.example.tsx', isDirectory: false },
    { name: 'SettingsForm.admin.example.tsx', isDirectory: false },
    { name: 'SettingsForm.test.ts', isDirectory: false },
    { name: 'SettingsForm.docs.mdx', isDirectory: false },
    { name: 'SettingsFormConfirmationDialog.tsx', isDirectory: false },
    { name: 'SettingsFormConfirmationDialog.default.example.tsx', isDirectory: false },
    { name: 'SettingsFormConfirmationDialog.admin.example.tsx', isDirectory: false },
    { name: 'SettingsFormConfirmationDialog.test.ts', isDirectory: false },
    { name: 'SettingsFormConfirmationDialog.docs.mdx', isDirectory: false },
  ].sort(betterDirectorySort), [
    { name: 'utils', isDirectory: true },
    { name: 'utils.i18n', isDirectory: true },
    { name: 'utils.i18n.langs', isDirectory: true },
    { name: '.gitignore', isDirectory: false },
    { name: 'SettingsForm.tsx', isDirectory: false },
    { name: 'SettingsForm.admin.example.tsx', isDirectory: false },
    { name: 'SettingsForm.default.example.tsx', isDirectory: false },
    { name: 'SettingsForm.docs.mdx', isDirectory: false },
    { name: 'SettingsForm.test.ts', isDirectory: false },
    { name: 'SettingsFormConfirmationDialog.tsx', isDirectory: false },
    { name: 'SettingsFormConfirmationDialog.admin.example.tsx', isDirectory: false },
    { name: 'SettingsFormConfirmationDialog.default.example.tsx', isDirectory: false },
    { name: 'SettingsFormConfirmationDialog.docs.mdx', isDirectory: false },
    { name: 'SettingsFormConfirmationDialog.test.ts', isDirectory: false },
  ]);
});

test('opts.comparator', t => {
  let input = Object.freeze([
    { name: 'Ab', isDirectory: false },
    { name: 'ab', isDirectory: false },
    { name: 'aa', isDirectory: false },
    { name: 'Aa', isDirectory: false },
  ]);

  t.deepEqual(input.slice().sort(betterDirectorySort), [
    { name: 'aa', isDirectory: false },
    { name: 'Aa', isDirectory: false },
    { name: 'Ab', isDirectory: false },
    { name: 'ab', isDirectory: false },
  ]);

  function comparator(a, b) {
    return a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'case',
    });
  }

  t.deepEqual(input.slice().sort(betterDirectorySort.custom({ comparator })), [
    { name: 'aa', isDirectory: false },
    { name: 'Aa', isDirectory: false },
    { name: 'ab', isDirectory: false },
    { name: 'Ab', isDirectory: false },
  ]);
});

test('opts.kinds', t => {
  t.deepEqual([
    { name: 'name.kindB.ext', isDirectory: false },
    { name: 'name.kindB.ext', isDirectory: false },
    { name: 'name.z.kindA.ext', isDirectory: false },
    { name: 'name.a.kindA.ext', isDirectory: false },
    { name: 'name.ext', isDirectory: false },
  ].sort(betterDirectorySort.custom({ kinds: true })), [
    { name: 'name.ext', isDirectory: false },
    { name: 'name.a.kindA.ext', isDirectory: false },
    { name: 'name.z.kindA.ext', isDirectory: false },
    { name: 'name.kindB.ext', isDirectory: false },
    { name: 'name.kindB.ext', isDirectory: false },
  ]);
});
