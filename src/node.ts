import { Train } from './train';

const permissionRequest = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
};

export class Node {
  siblings: Array<Node> = [];

  constructor(public id: string, public x: number, public y: number) {}

  async ask(train: Train): Promise<boolean> {
    const a = await permissionRequest();
    return true;
  }
}
