import * as R from 'ramda';
import { Node } from './node';

export interface Net extends Array<Line> {}
export interface Line extends Array<Node> {}

const mapIndexed = R.addIndex(R.map);

const connect = (node1: Node, node2: Node, siblings: Node[][]) => {
  const [s1, s2] = siblings;

  node1.siblings = s1;
  node2.siblings = s2;
};

const bothSiblings = (node1: Node, node2: Node): Node[][] => {
  return [R.append(node2, node1.siblings), R.append(node1, node2.siblings)];
};

const net: Net = mapIndexed(
  (line, lIdx) => {
    const nodes: Node[] = mapIndexed(
      (n, idx) => new Node(`l${lIdx}-s${idx}`, 50 + 50 * lIdx, 50 + 20 * idx),
      line as Line
    ) as Node[];

    const withSiblings = mapIndexed((node: Node, idx, arr: Node[]) => {
      const sibling: Node = arr[idx - 1] as Node;
      if (sibling) {
        connect(
          node,
          sibling,
          bothSiblings(node, sibling)
        );
      }
      return node;
    }, nodes);

    return withSiblings;
  },
  [R.range(0, 5), R.range(0, 8), R.range(0, 4), R.range(0, 10)]
) as Line[];

const l0_s3 = net[0][3];
const l1_s2 = net[1][2];
const l1_s0 = net[1][0];
const l2_s2 = net[2][2];
const l2_s3 = net[2][3];
const l3_s3 = net[2][3];

connect(
  l0_s3,
  l1_s2,
  bothSiblings(l0_s3, l1_s2)
);
connect(
  l1_s0,
  l2_s2,
  bothSiblings(l1_s0, l2_s2)
);
connect(
  l2_s3,
  l3_s3,
  bothSiblings(l2_s3, l3_s3)
);

export { net };
