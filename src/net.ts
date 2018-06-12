import { addIndex, map, range, append } from 'ramda';
import { Node } from './node';

export interface Net extends Array<Line> {}
export interface Line extends Array<Node> {}

const mapIndexed = addIndex(map);

export const connect = (node1: Node, node2: Node, siblings: Node[][]) => {
  const [s1, s2] = siblings;

  node1.siblings = s1;
  node2.siblings = s2;
};

export const bothSiblings = (node1: Node, node2: Node): Node[][] => {
  return [append(node2, node1.siblings), append(node1, node2.siblings)];
};

const net: Net = mapIndexed(
  (line, lIdx) => {
    const nodes: Node[] = mapIndexed(
      (n, idx) => new Node(`l${lIdx}-s${idx}`, 150 * lIdx, 100 * idx),
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
  [range(0, 5), range(0, 8), range(0, 4), range(0, 10)]
) as Line[];

const l0_s3 = net[0][3];
const l1_s2 = net[1][2];
const l1_s0 = net[1][0];
const l1_s1 = net[1][1];
const l1_s7 = net[1][7];
const l2_s0 = net[2][0];
const l2_s2 = net[2][2];
const l2_s3 = net[2][3];
const l3_s3 = net[3][3];
const l3_s7 = net[3][7];

connect(
  l0_s3,
  l1_s2,
  bothSiblings(l0_s3, l1_s2)
);
connect(
  l1_s0,
  l2_s0,
  bothSiblings(l1_s0, l2_s0)
);
connect(
  l1_s1,
  l2_s2,
  bothSiblings(l1_s1, l2_s2)
);
connect(
  l2_s3,
  l3_s3,
  bothSiblings(l2_s3, l3_s3)
);
connect(
  l1_s7,
  l3_s7,
  bothSiblings(l1_s7, l3_s7)
);

export { net };
