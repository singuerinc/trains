import { forEach, append, reduce, memoize, minBy } from 'ramda';
import { Node } from './node';

export const interpolate = (o, d, frac: number) => {
  const nx = o.x + (d.x - o.x) * frac;
  const ny = o.y + (d.y - o.y) * frac;
  return [nx, ny];
};

const shortest = memoize(reduce(minBy(x => x.length)));

//                 x-----x--->
//                /
//--O---O---O----x----x---->
//           \
//            O-----X---->
export const explorer = (origin: Node, dest: Node): Node[] => {
  let results = [];
  const finder = (
    from: Node,
    to: Node,
    parent: Node = null,
    path: object = {}
  ) => {
    forEach(sibling => {
      // don't walk backwards
      if (sibling === parent) return;

      // // found!
      if (sibling === to) {
        results = append(path.path, results);
        return;
      }

      path[sibling.id] = {
        next: finder(sibling, dest, from, {
          path: path.path ? [...path.path, sibling] : [sibling]
        })
      };
    }, from.siblings);

    return path;
  };

  finder(origin, dest);

  return shortest(results[0])(results);
};
