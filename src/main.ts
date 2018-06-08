import paper from 'paper';
import { forEach, append, addIndex, indexOf, map } from 'ramda';
import { net } from './net';
import { Node } from './node';
import { explorer } from './route';

const mapIndexed = addIndex(map);
const connection = (n1, n2) => `${n1.id}+${n2.id}`;
const connectionExist = (n1, n2, list) => {
  return (
    indexOf(connection(n1, n2), list) !== -1 ||
    indexOf(connection(n2, n1), list) !== -1
  );
};
const log = map((node: Node) => `==-( ${node.id} )-==`);

const drawLine = (line, connections): string[] => {
  let c: string[] = [];
  forEach(node => {
    c = drawNode(node, connections);
  }, line);
  return c;
};

const drawNode = (node, connections): string[] => {
  let c: string[] = [];
  const circle = new paper.Path.Circle(new paper.Point(node.x, node.y), 3);
  circle.strokeColor = 'black';
  forEach(sibling => {
    if (!connectionExist(node, sibling, connections)) {
      drawSiblings(node, sibling);
      c = append(connection(node, sibling), connections);
    }
  }, node.siblings);
  return c;
};

const drawSiblings = (node, sibling) => {
  const path = new paper.Path();
  path.strokeColor = new paper.Color(
    Math.random(),
    Math.random(),
    Math.random()
  );
  const start = new paper.Point(node.x, node.y);
  path.moveTo(start);
  path.lineTo(new paper.Point(sibling.x, sibling.y));
};

const drawRoute = mapIndexed((node: Node, idx, arr) => {
  const sibling = arr[idx + 1] as Node;
  if (sibling) {
    const path = new paper.Path();
    path.strokeColor = 'cyan';
    path.strokeWidth = 10;
    path.opacity = 0.5;
    const start = new paper.Point(node.x, node.y);
    path.moveTo(start);
    path.lineTo(new paper.Point(sibling.x, sibling.y));
  }
});

const route = explorer(net[0][0], net[3][4]);

console.log(log(route));

window.onload = function() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  paper.setup(canvas);

  forEach(line => {
    drawLine(line, []);
  }, net);

  drawRoute(route);

  paper.view.draw();
};
