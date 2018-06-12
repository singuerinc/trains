import paper from 'paper';
import { forEach, append, addIndex, indexOf, sort, map, last } from 'ramda';
import { net } from './net';
import { Node } from './node';
import { explorer, shortest } from './route';
import { Train } from './train';

const forEachIndexed = addIndex(forEach);
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
  const text = new paper.PointText(new paper.Point(node.x + 20, node.y - 20));
  text.justification = 'center';
  text.fillColor = 'black';
  text.content = node.id;
  text.rotation = -45;
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
  path.strokeColor = 'grey';
  const start = new paper.Point(node.x, node.y);
  path.moveTo(start);
  path.lineTo(new paper.Point(sibling.x, sibling.y));
};

const drawRoute = (r, i, c) =>
  forEachIndexed((node: Node, idx, arr) => {
    const sibling = arr[idx + 1] as Node;
    if (sibling) {
      const path = new paper.Path();
      path.strokeColor = i === c.length - 1 ? 'cyan' : 'red';
      path.strokeWidth = i === c.length - 1 ? 10 : 5;
      path.opacity = i === c.length - 1 ? 0.7 : 0.3;
      const start = new paper.Point(node.x, node.y);
      path.moveTo(start);
      path.lineTo(new paper.Point(sibling.x, sibling.y));
    }
  })(r);

const drawTrains = (trains): paper.Path.Circle[] => {
  let arr = [];
  forEach((train: Train) => {
    const circle = new paper.Path.Circle(new paper.Point(train.x, train.y), 8);
    circle.fillColor = 'grey';
    circle.strokeWidth = 2;
    circle.strokeColor = 'black';
    arr = append(circle, arr);
  }, trains);
  return arr;
};

const routes = sort(
  (a, b) => a.length < b.length,
  explorer(net[0][0], net[3][6])
);
console.log(routes);
const route = last(routes);

const train = new Train('Yolanda', route);

// console.log(log(route));

window.onload = function() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  paper.setup(canvas);

  forEach(line => {
    drawLine(line, []);
  }, net);

  forEachIndexed(drawRoute, routes);
  const myTrains = drawTrains([train]);

  setInterval(() => {
    myTrains[0].position.x = train.x;
    myTrains[0].position.y = train.y;
    paper.view.draw();
  }, 100);
};
