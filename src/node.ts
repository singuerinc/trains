import { append, filter } from 'ramda';
import { Train } from './train';
import { ICargo } from './cargo';

const waitUntilIsFree = async () => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1); // free
  });
};

const inspect = async train => {
  return new Promise<boolean>((resolve, reject) => {
    setTimeout(() => {
      // this train is clean
      resolve(true);
    }, 1000);
  });
};

const permissionRequest = async (train: Train) => {
  // check whatever we need to know about the train
  await waitUntilIsFree();
  return await inspect(train);
};

export class Node {
  siblings: Node[] = [];
  cargo: ICargo[] = [];

  constructor(public id: string, public x: number, public y: number) {}

  async ask(train: Train): Promise<boolean> {
    return permissionRequest(train);
  }

  getWaitingCargo(route: Node[]): ICargo[] {
    return filter(x => x.wants(route), this.cargo) as ICargo[];
  }

  add(cargo: ICargo) {
    this.cargo = append(cargo, this.cargo);
  }

  remove(cargo: ICargo) {
    const notCargo = x => x !== cargo;
    this.cargo = filter(notCargo, this.cargo);
  }
}
