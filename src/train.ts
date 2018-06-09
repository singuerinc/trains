import { head, drop, take } from 'ramda';
import { Node } from './node';
import { interpolate } from './route';

export class Train {
  public x = 0;
  public y = 0;
  constructor(public id: string, public route: Node[]) {
    const { x: rx, y: ry } = head(this.route);
    this.x = rx;
    this.y = ry;
    const run = (path: Node[]) => {
      setTimeout(async () => {
        const r = drop(1, path);
        const first = head(r);
        if (!first) return;
        await this.go(first, r);
        run(r);
      }, 100);
    };
    run(route);
  }

  async go(node: Node, path: Node[]): Promise<boolean> {
    console.log(this, `Access request to ${node.id}`);
    const answer = await node.ask(this);
    console.log(this, 'Access granted!');
    return new Promise<boolean>((resolve, reject) => {
      const move = (x1, y1, x2, y2, f) => {
        f = Math.min(1, f);
        const [x, y] = interpolate({ x: x1, y: y1 }, { x: x2, y: y2 }, f);
        console.log(`Moving towards ${node.id} ${100 * f}%`);
        this.x = x;
        this.y = y;
        if (f >= 1) {
          return resolve(true);
        }
        setTimeout(async () => {
          move(x1, y1, x2, y2, f + 0.05);
        }, 500);
      };
      move(this.x, this.y, node.x, node.y, 0);
    });
  }

  toString() {
    return `Train ${this.id}`;
  }
}
