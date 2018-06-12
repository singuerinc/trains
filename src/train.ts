import anime = require('animejs');
import { head, append, concat, forEach, filter, drop } from 'ramda';
import { Node } from './node';
import { ICargo } from './cargo';

export class Train {
  public x = 0;
  public y = 0;
  public cargo: ICargo[];

  constructor(public id: string, public route: Node[]) {
    const { x: rx, y: ry } = head(this.route);

    this.cargo = [];
    this.x = rx;
    this.y = ry;

    const run = async (path: Node[]) => {
      const r = drop(1, path);
      const h = head(r);

      if (!h) return;

      await this.go(h, r);

      run(r);
    };

    run(route);
  }

  async go(node: Node, path: Node[]) {
    console.log(this, `Access request to ${node.id}`);

    const answer = await node.ask(this);

    console.log(this, answer, 'Access granted!, entering...');

    await anime({
      targets: this,
      x: node.x,
      y: node.y,
      easing: 'linear',
      update: () => {
        forEach(c => {
          c.x = this.x;
          c.y = this.y;
        }, this.cargo);
      }
    }).finished;

    forEach(x => x.setAt(this), this.cargo);

    const cargo = node.getWaitingCargo(this.route);

    forEach(x => node.remove(x), cargo);
    forEach(c => {
      this.add(c);
      c.setAt(this);
    }, cargo);

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    // return new Promise<boolean>((resolve, reject) => {
    //   const move = (x1, y1, x2, y2, c) => {
    //     const f = Math.min(1, c);
    //     const [x, y] = interpolate({ x: x1, y: y1 }, { x: x2, y: y2 }, f);

    //     console.log(`Moving towards ${node.id} ${100 * f}%`);

    //     this.x = x;
    //     this.y = y;

    //     if (f >= 1) {
    //       return resolve(true);
    //     }

    //     setTimeout(async () => {
    //       move(x1, y1, x2, y2, f + 0.05);
    //     }, 200);
    //   };
    //   move(this.x, this.y, node.x, node.y, 0);
    // });
  }

  add(cargo: ICargo) {
    this.cargo = append(cargo, this.cargo);
  }

  remove(cargo: ICargo) {
    const notCargo = x => x !== cargo;
    this.cargo = filter(notCargo, this.cargo);
  }

  toString() {
    return `Train ${this.id}`;
  }
}
