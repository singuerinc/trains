import * as R from 'ramda';

export class Node {
  siblings: Array<Node> = [];

  constructor(public id: string, public x: number, public y: number) {}
}
