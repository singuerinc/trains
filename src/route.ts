import * as R from 'ramda';
import { Node } from './node';

//                 x-----x--->
//                /
//--O---O---O----x----x---->
//           \
//            O-----X---->
export const explorer = (origin: Node, dest: Node) => {
  let results = [];
  const finder = (
    from: Node,
    to: Node,
    parent: Node = null,
    path: object = {}
  ) => {
    R.forEach(sibling => {
      // don't walk backwards
      if (sibling === parent) return;

      // // found!
      if (sibling === to) {
        results = R.append(path.path, results);
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

  return results;
};
