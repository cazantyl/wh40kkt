import { Weapon } from './weapon.model';

export class Unit {
  uuid: string;
  name: string;
  image: string;
  warband: string;
  cost: number;

  movement: number;
  defense: number;
  wounds: number;

  weapon1: Weapon;
  weapon2: Weapon;
}
