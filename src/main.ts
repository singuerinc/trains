import paper from "paper";
import * as R from "ramda";
import { Node } from "./node";

const connect = (node1, node2) => {
  node1.siblings = R.append(node2, node1.siblings);
  node2.siblings = R.append(node1, node2.siblings);
};

const nodes_l1 = R.range(0, 5)
  .map((node, idx, arr) => {
    return new Node(`t-l1-${idx}`, 20, 20 * idx);
  })
  .map((node, idx, arr) => {
    const sibling: Node = arr[idx - 1];
    if (sibling) {
      connect(
        node,
        sibling
      );
    }
    return node;
  });

const nodes_l2 = R.range(0, 10)
  .map((node, idx, arr) => {
    return new Node(`t-l2-${idx}`, 40, 20 * idx);
  })
  .map((node, idx, arr) => {
    const sibling: Node = arr[idx - 1];
    if (sibling) {
      connect(
        node,
        sibling
      );
    }
    return node;
  });

connect(
  nodes_l1[2],
  nodes_l2[1]
);

const net = [nodes_l1, nodes_l2];

console.log(nodes_l1);
console.log(nodes_l2);

window.onload = function() {
  const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
  paper.setup(canvas);

  R.forEach(line => {
    const path = new paper.Path();
    path.strokeColor = "black";
    const start = new paper.Point(0, 0);
    path.moveTo(start);

    R.forEach(node => {
      path.lineTo(start.add([node.x, node.y]));
    }, line);
  }, net);

  paper.view.draw();
};
