// @flow

/*::
type Entity = {
  name: string,
  isDirectory: boolean,
};
*/

function betterDirectorySort(a /*: Entity */, b /*: Entity */) /*: number */ {

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

  // final part is only used when the rest of the name is the same
  let aExt = aParts.pop();
  let bExt = bParts.pop();

  // loop with an incrementing index
  let i = 0;
  while (true) {
    let aPart = aParts[i];
    let bPart = bParts[i];

    // if there's no more parts on either name, break
    if (!aPart && !bPart) break;

    // prefer names with less parts
    if (aPart && !bPart) return 1;
    if (bPart && !aPart) return -1;

    // compare the current part, if its the same, continue comparing parts
    let compared = aPart.localeCompare(bPart);
    if (compared !== 0) return compared;

    i++;
  }

  // compare the last part as a final tie-breaker
  return aExt.localeCompare(bExt);
}

module.exports = betterDirectorySort;
