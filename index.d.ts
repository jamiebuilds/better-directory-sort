// @flow

type Comparator<T> = (a: T, b: T) => number;

type Entity = {
  name: string,
  isDirectory: boolean,
};

declare const betterDirectorySort: Comparator<Entity> & {
  custom: (comparator: Comparator<string>) => Comparator<Entity>,
  defaultComparator: Comparator<string>,
};

export default betterDirectorySort;
