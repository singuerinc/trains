import paper from 'paper';
import * as R from 'ramda';
import { net } from './net';

const connection = (n1, n2) => `${n1.id}+${n2.id}`;
const connectionExist = (n1, n2, list) => {
  return (
    R.indexOf(connection(n1, n2), list) !== -1 ||
    R.indexOf(connection(n2, n1), list) !== -1
  );
};

window.onload = function() {
  const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  paper.setup(canvas);

  let connections = [];

  R.forEach(line => {
    R.forEach(node => {
      const circle = new paper.Path.Circle(new paper.Point(node.x, node.y), 3);
      circle.strokeColor = 'black';
      // path.lineTo(start.add([node.x, node.y]));
      R.forEach(sibling => {
        if (!connectionExist(node, sibling, connections)) {
          console.log('NO ', connection(node, sibling));
          const path = new paper.Path();
          path.strokeColor = new paper.Color(
            Math.random(),
            Math.random(),
            Math.random()
          );
          const start = new paper.Point(node.x, node.y);
          path.moveTo(start);
          path.lineTo(new paper.Point(sibling.x, sibling.y));
          connections = R.append(connection(node, sibling), connections);
        } else {
          console.log('YES', connection(node, sibling));
        }
      }, node.siblings);
    }, line);
  }, net);

  paper.view.draw();
};
