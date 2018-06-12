import * as PIXI from 'pixi.js';
import { forEach, append, addIndex, indexOf } from 'ramda';
import { Train } from './train';
import { Node } from './node';
import { Net } from './net';
import { ICargo } from './cargo';
const forEachIndexed = addIndex(forEach);

const connection = (n1, n2) => `${n1.id}+${n2.id}`;
const connectionExist = (n1, n2, list) => {
  return (
    indexOf(connection(n1, n2), list) !== -1 ||
    indexOf(connection(n2, n1), list) !== -1
  );
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

const drawCargo = (cargo, layer): PIXI.Graphics[] => {
  let arr: PIXI.Graphics[] = [];
  forEach((obj: ICargo) => {
    const g = new PIXI.Graphics();
    g.x = obj.x;
    g.y = obj.y;
    g.beginFill(0x000000);
    g.drawCircle(0, 0, 7);
    g.endFill();
    layer.addChild(g);

    arr = append(g, arr);
  }, cargo);
  return arr;
};

const drawTrains = (trains, layer) => {
  let arr: PIXI.Graphics[] = [];
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
const layers = new PIXI.Graphics();
const netLayer = new PIXI.Graphics();
const routesLayer = new PIXI.Graphics();
const trainsLayer = new PIXI.Graphics();
const cargoLayer = new PIXI.Graphics();

layers.addChild(netLayer);
layers.addChild(routesLayer);
layers.addChild(trainsLayer);
layers.addChild(cargoLayer);

layers.x = 50;
layers.y = 50;

stage.addChild(layers);

export const draw = (
  net: Net,
  routes: Node[][],
  trains: Train[],
  cargo: ICargo[]
) => {
  const drawLines = forEach(line => {
    const layer = new PIXI.Graphics();
    netLayer.addChild(layer);
    drawLine(line, [], layer);
  });

  drawLines(net);
  forEachIndexed(drawRoute(routesLayer), routes);
  const cc = drawCargo(cargo, cargoLayer);
  const tt = drawTrains(trains, trainsLayer);

  const loop = () => {
    tt[0].position.x = trains[0].x;
    tt[0].position.y = trains[0].y;

    cc[0].position.x = cargo[0].x;
    cc[0].position.y = cargo[0].y;

    requestAnimationFrame(loop);
    renderer.render(stage);
  };

  // renderer.render(stage);
  loop();
};
