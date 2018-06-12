import { sort, head } from 'ramda';
import { net } from './net';
import { Node } from './node';
import { explorer, shortest } from './route';
import { Train } from './train';
import { draw } from './draw';
import { Person } from './person';

const routesSorted = sort((a: Node[], b: Node[]) =>
  Math.max(a.length, b.length)
);

const from = net[0][0];
const to = net[3][6];

const routes = explorer(from, to) as Node[][];

const person = new Person();
const station = net[0][2];
station.add(person);
person.setAt(station);

const train = new Train('Yolanda', head(routesSorted(routes)));

draw(net, routes, [train], [person]);
