import paper from "paper";
import * as R from "ramda";
import { Node } from "./node";

interface Line extends Array<Node> {}

const mapIndexed = R.addIndex(R.map);

const connect = (node1, node2) => {
  node1.siblings = R.append(node2, node1.siblings);
  node2.siblings = R.append(node1, node2.siblings);
};

const nums = [R.range(0, 5), R.range(0, 8), R.range(0, 4), R.range(0, 10)];

const net: Line[] = mapIndexed((line, lIdx) => {
  const nodes: Node[] = mapIndexed(
    (n, idx) => new Node(`t-l1-${idx}`, 50 + 50 * lIdx, 50 + 20 * idx),
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
}, nums) as Line[];

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

window.onload = function() {
  const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
  paper.setup(canvas);

  R.forEach(line => {
    R.forEach(node => {
      const circle = new paper.Path.Circle(new paper.Point(node.x, node.y), 3);
      circle.strokeColor = "black";
      // path.lineTo(start.add([node.x, node.y]));
      R.forEach(sibling => {
        const path = new paper.Path();
        path.strokeColor = "black";
        const start = new paper.Point(node.x, node.y);
        path.moveTo(start);
        path.lineTo(new paper.Point(sibling.x, sibling.y));
      }, node.siblings);
    }, line);
  }, net);

  paper.view.draw();
};
