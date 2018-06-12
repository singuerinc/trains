import { ICargo } from './cargo';
import { Node } from './node';

export class Person implements ICargo {
  x: number;
  y: number;

  setAt({ x, y }: { x: number; y: number }) {
    this.x = x;
    this.y = y;
    // if is somewhere, remove from it
    // if (this.at) {
    //   this.at.remove(this);
    // }
    // add it as cargo
    // this.at = place;
    // console.log('setAt', this.at);
    // this.at.add(this);
  }

  wants(route: Node[]) {
    console.log('I want to go!');
    return true;
  }
}
