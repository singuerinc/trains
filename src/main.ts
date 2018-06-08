import paper from 'paper';
import * as R from 'ramda';
import { net } from './net';
import { finder } from './route';

const connection = (n1, n2) => `${n1.id}+${n2.id}`;
const connectionExist = (n1, n2, list) => {
  return (
    R.indexOf(connection(n1, n2), list) !== -1 ||
    R.indexOf(connection(n2, n1), list) !== -1
  );
};

const drawLine = (line, connections): string[] => {
  let c: string[] = [];
  R.forEach(node => {
    c = drawNode(node, connections);
  }, line);
  return c;
};

const drawNode = (node, connections): string[] => {
  let c: string[] = [];
  const circle = new paper.Path.Circle(new paper.Point(node.x, node.y), 3);
  circle.strokeColor = 'black';
  R.forEach(sibling => {
    if (!connectionExist(node, sibling, connections)) {
      drawSiblings(node, sibling);
      c = R.append(connection(node, sibling), connections);
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

window.onload = function() {
  const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  paper.setup(canvas);

  R.forEach(line => {
    drawLine(line, []);
  }, net);

  paper.view.draw();
};

const r = finder(net[0][0], null, net[0][3], {});
console.log(JSON.parse(JSON.stringify(r)));
