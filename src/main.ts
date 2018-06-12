import { sort, head } from 'ramda';
import { net } from './net';
import { Node } from './node';
import { explorer, shortest } from './route';
import { Train } from './train';
import { draw } from './draw';

const from = net[0][0];
const to = net[3][6];

const routes = explorer(from, to) as Node[][];

const sortedByLength = sort(
  (a: Node[], b: Node[]) => Math.max(a.length, b.length),
  routes
);

const route = head(sortedByLength);
const train = new Train('Yolanda', route);

draw(net, routes, [train]);
