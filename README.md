# better-directory-sort

> Improved sorting order for directory entities

File tree views in editors like Atom and Visual Studio Code use a very simple
sort for listing files and directories:

- Place directories before files
- Sort by name

But that often produces results that don't line up with how developers think
about these files. For example, they will place files like this:

```
SettingsForm.test.ts
SettingsForm.ts
```

Which is backwards from what developers would expect: The test file is
secondary to the source file it is testing.

**Before:**

```
SettingsForm.admin.example.tsx
SettingsForm.default.example.tsx
SettingsForm.docs.mdx
SettingsForm.test.ts
SettingsForm.tsx
SettingsFormConfirmationDialog.admin.example.tsx
SettingsFormConfirmationDialog.default.example.tsx
SettingsFormConfirmationDialog.docs.mdx
SettingsFormConfirmationDialog.test.ts
SettingsFormConfirmationDialog.tsx
```

**After:**

```
SettingsForm.tsx
SettingsForm.admin.example.tsx
SettingsForm.default.example.tsx
SettingsForm.docs.mdx
SettingsForm.test.ts
SettingsFormConfirmationDialog.tsx
SettingsFormConfirmationDialog.admin.example.tsx
SettingsFormConfirmationDialog.default.example.tsx
SettingsFormConfirmationDialog.docs.mdx
SettingsFormConfirmationDialog.test.ts
```

Oh and directories are still placed first too.

See [test.js](./test.js) for more info on the sort order.

## Install

```sh
yarn add better-directory-sort
```

## Usage

```js
const betterDirectorySort = require('better-directory-sort');

let ents = [
  { name: 'utils', isDirectory: true },
  { name: 'fixtures', isDirectory: true },
  { name: 'SettingsForm.tsx', isDirectory: false },
  { name: 'SettingsForm.default.example.tsx', isDirectory: false },
  ...
];

let sorted = ents.sort(betterDirectorySort);
```

```js
const betterDirectorySort = require('better-directory-sort');
const fs = require('fs');

let ents = fs.readdirSync('/path/to/dir', { withFileTypes: true }); // Node >=10.10

let sorted = ents.sort((a, b) => {
  return betterDirectorySort(
    { name: a.name, isDirectory: a.isDirectory() },
    { name: b.name, isDirectory: b.isDirectory() },
  );
});
```
