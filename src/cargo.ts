import { Node } from './node';
import { Train } from './train';

export interface ICargo {
  x: number;
  y: number;
  wants(route: Node[]): boolean;
  setAt({ x, y }: { x: number; y: number });
}
