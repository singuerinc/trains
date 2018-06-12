import * as PIXI from 'pixi.js';
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

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const renderer = new PIXI.CanvasRenderer({
  autoResize: true,
  backgroundColor: 0xfdfdfd,
  height: window.innerHeight,
  resolution: 2,
  roundPixels: true,
  width: window.innerWidth
});

renderer.view.style.position = 'absolute';
renderer.view.style.display = 'block';

window.addEventListener('resize', () => {
  renderer.resize(window.innerWidth, window.innerHeight);
});

document.body.appendChild(renderer.view);

const stage = new PIXI.Container();

stage.interactive = true;

const layers = new PIXI.Graphics();
// layers.scale.set(0.5);
const netLayer = new PIXI.Graphics();
layers.addChild(netLayer);
const routesLayer = new PIXI.Graphics();
layers.addChild(routesLayer);
const trainsLayer = new PIXI.Graphics();
layers.addChild(trainsLayer);
layers.x = 50;
layers.y = 50;
stage.addChild(layers);

const loop = () => {
  requestAnimationFrame(loop);
  renderer.render(stage);
};

const drawLine = (line, connections, layer): string[] => {
  let c: string[] = [];
  forEach(node => {
    c = drawNode(node, connections, layer);
  }, line);
  return c;
};

const drawNode = (node, connections, layer): string[] => {
  let c: string[] = [];
  const circle = new PIXI.Graphics();
  circle.beginFill(0x666666);
  circle.lineStyle(3, 0x999999);
  circle.drawCircle(node.x, node.y, 10);
  circle.endFill();
  layer.addChild(circle);
  // const text = new paper.PointText(new paper.Point(node.x + 20, node.y - 20));
  // text.justification = 'center';
  // text.fillColor = 'black';
  // text.content = node.id;
  // text.rotation = -45;
  forEach(sibling => {
    if (!connectionExist(node, sibling, connections)) {
      drawSiblings(node, sibling, layer);
      c = append(connection(node, sibling), connections);
    }
  }, node.siblings);
  return c;
};

const drawSiblings = (node, sibling, layer) => {
  const path = new PIXI.Graphics();
  path.x = node.x;
  path.y = node.y;
  path.lineStyle(2, 0x999999);
  path.moveTo(0, 0);
  path.lineTo(sibling.x - node.x, sibling.y - node.y);

  layer.addChild(path);
};

const drawRoute = layer => (r, i, c) =>
  forEachIndexed((node: Node, idx, arr) => {
    const sibling = arr[idx + 1] as Node;
    if (sibling) {
      const first = i === c.length - 1;
      const path = new PIXI.Graphics();
      path.x = node.x;
      path.y = node.y;
      path.lineStyle(
        first ? 10 : 5,
        first ? 0x00ffff : 0xff0000,
        first ? 0.7 : 0.3
      );
      path.moveTo(0, 0);
      path.lineTo(sibling.x - node.x, sibling.y - node.y);
      layer.addChild(path);
    }
  })(r);

const drawTrains = (trains, layer): PIXI.Graphics[] => {
  let arr = [];
  forEach((train: Train) => {
    const circle = new PIXI.Graphics();
    circle.beginFill(0xff6666);
    circle.lineStyle(3, 0x999999);
    circle.drawCircle(train.x, train.y, 10);
    circle.endFill();
    layer.addChild(circle);

    arr = append(circle, arr);
  }, trains);
  return arr;
};

const routes = sort(
  (a, b) => a.length < b.length,
  explorer(net[0][0], net[3][6])
);

const route = last(routes);

const train = new Train('Yolanda', route);

// console.log(log(route));

forEach(line => {
  const lineLayer = new PIXI.Graphics();
  netLayer.addChild(lineLayer);
  drawLine(line, [], lineLayer);
}, net);

forEachIndexed(drawRoute(routesLayer), routes);
const trains = drawTrains([train], trainsLayer);

setInterval(() => {
  trains[0].position.x = train.x;
  trains[0].position.y = train.y;
}, 100);
// };

loop();
// renderer.render(stage);
