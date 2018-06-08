import * as R from 'ramda';
import { Node } from './node';

export interface Net extends Array<Line> {}
export interface Line extends Array<Node> {}

const mapIndexed = R.addIndex(R.map);

const connect = (node1, node2) => {
  node1.siblings = R.append(node2, node1.siblings);
  node2.siblings = R.append(node1, node2.siblings);
};

const net: Net = mapIndexed(
  (line, lIdx) => {
    const nodes: Node[] = mapIndexed(
      (n, idx) => new Node(`t-l${lIdx}-${idx}`, 50 + 50 * lIdx, 50 + 20 * idx),
      line as Line
    ) as Node[];

    const withSiblings = mapIndexed((node, idx, arr) => {
      const sibling: Node = arr[idx - 1] as Node;
      if (sibling) {
        connect(
          node,
          sibling
        );
      }
      return node;
    }, nodes);

    return withSiblings;
  },
  [R.range(0, 5), R.range(0, 8), R.range(0, 4), R.range(0, 10)]
) as Line[];

connect(
  net[0][3],
  net[1][2]
);

connect(
  net[1][0],
  net[2][2]
);

connect(
  net[2][3],
  net[3][3]
);

export { net };
