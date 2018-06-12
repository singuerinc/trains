import { Train } from './train';

const inspect = async (train): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      // this train is clean
      resolve(true);
    }, 1000);
  });
};

const permissionRequest = async (train: Train) => {
  const passInspection = await inspect(train);
  if (passInspection === true) {
    return true;
  }
};

export class Node {
  siblings: Array<Node> = [];

  constructor(public id: string, public x: number, public y: number) {}

  async ask(train: Train): Promise<boolean> {
    return permissionRequest(train);
  }
}
