import * as R from 'ramda';
import { Node } from './node';

export const finder = (origin: Node, parent: Node, dest: Node, path) => {
  R.forEach(s => {
    if (s === parent) return;
    if (s === dest) return;
    path[s.id] = finder(s, origin, dest, {});
  }, origin.siblings);

  return path;
};
