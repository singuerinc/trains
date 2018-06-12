import { addIndex, map, range } from 'ramda';
const mapIndexed = addIndex(map);

import { explorer, shortest } from './route';
import { Node } from './node';
import { connect, bothSiblings, Net, Line } from './net';

describe('explorer', () => {
  it('should find', () => {
    const net: Net = mapIndexed(
      (line, lIdx) => {
        const nodes = mapIndexed(
          (n, idx) => new Node(`l${lIdx}-s${idx}`, 0, 0),
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
        }, nodes) as Node[];

        return withSiblings;
      },
      [range(0, 5), range(0, 5), range(0, 5)]
    ) as Line[];

    connect(
      net[0][2],
      net[1][2],
      bothSiblings(net[0][2], net[1][2])
    );

    connect(
      net[1][3],
      net[2][4],
      bothSiblings(net[1][3], net[2][4])
    );

    const from: Node = net[0][0];
    const to: Node = net[2][3];

    const routes: Node[] = explorer(from, to);
    const found = shortest(routes[0])(routes);

    expect(found).toHaveLength(7);
    expect(found[0].id).toBe('l0-s0');
    expect(found[1].id).toBe('l0-s1');
    expect(found[2].id).toBe('l0-s2');
    expect(found[3].id).toBe('l1-s2');
    expect(found[4].id).toBe('l1-s3');
    expect(found[5].id).toBe('l2-s4');
    expect(found[6].id).toBe('l2-s3');
  });
});
