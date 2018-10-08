// @flow

function defaultComparator(a, b) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function compareSafe(a, b, comparator) {
  if (a == null && b == null) return 0;
  if (a != null && b == null) return 1;
  if (b != null && a == null) return -1;
  return comparator(a, b);
}

/*::
type Comparator<T> = (a: T, b: T) => number;

type Entity = {
  name: string,
  isDirectory: boolean,
};

type Opts = {
  comparator?: Comparator<string>,
  kinds?: boolean,
};
*/

function createBetterDirectorySort(opts /*: Opts */ = {}) /*: Comparator<Entity> */ {
  let comparator = opts.comparator || defaultComparator;
  let kinds = opts.kinds || false;

  return function betterDirectorySort(a, b) {
    // directories should be placed before files
    if (a.isDirectory && !b.isDirectory) return -1;
    if (b.isDirectory && !a.isDirectory) return 1;

    // dotsfiles should be placed before non-dotfiles
    let aDot = a.name[0] === '.';
    let bDot = b.name[0] === '.';
    if (aDot && !bDot) return -1;
    if (bDot && !aDot) return 1;

    // names will be sorted in period-delimitted parts
    let aParts = a.name.split('.');
    let bParts = b.name.split('.');

    // the first part of the name is the most important part
    let aName = aParts.shift();
    let bName = bParts.shift();

    // final extension is only used when all else is the same
    let aExt = aParts.pop();
    let bExt = bParts.pop();

    let comparedName = compareSafe(aName, bName, comparator);
    if (comparedName !== 0) return comparedName;

    // "kind" extension is used above other parts
    if (kinds) {
      let aKind = aParts.pop();
      let bKind = bParts.pop();

      let comparedKind = compareSafe(aKind, bKind, comparator);
      if (comparedKind !== 0) return comparedKind;
    }

    // loop with an decrementing index
    let i = 0;
    while (true) {
      let aPart = aParts[i];
      let bPart = bParts[i];

      // if there's no more parts on either name, break
      if (aPart == null && bPart == null) break;

      // compare the current part, if its the same, continue comparing parts
      let comparedPart = compareSafe(aPart, bPart, comparator);
      if (comparedPart !== 0) return comparedPart;

      i++;
    }

    // compare the last extension as a final tie-breaker
    return compareSafe(aExt, bExt, comparator);
  };
}

const betterDirectorySort = createBetterDirectorySort();

betterDirectorySort.custom = createBetterDirectorySort;
betterDirectorySort.defaultComparator = defaultComparator;

module.exports = betterDirectorySort;
