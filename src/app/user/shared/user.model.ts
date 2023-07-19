import { Model } from '@model';

export class User extends Model {
  uid: string;
  firstName: string;
  lastName: string;
  role: string;
  theme: boolean;
  hasImage: boolean;
  hasPlanner: boolean;
  hasAdminView: boolean;

  name: string;
  isAdmin: boolean;
  isPending: boolean;
  recipeCount: number;
  ratingCount: number;
  image: string;

  constructor(data: any) {
    super(data);
    this.uid = data.uid || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.name = `${this.firstName} ${this.lastName}`;
    this.role = data.role || '';
    this.theme = data.theme || false;
    this.hasImage = data.hasImage || false;
    this.hasPlanner = data.hasPlanner || false;
    this.hasAdminView = data.hasAdminView || false;
    this.isAdmin = data.role === ROLE.ADMIN;
    this.isPending = data.role === ROLE.PENDING;
  }

  public getObject(): UserObject {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, name, isAdmin, isPending, recipeCount, ratingCount, image, ...user } = this;
    return user;
  }
}

export type UserObject = Omit<
  User,
  | 'id'
  | 'getId'
  | 'getObject'
  | 'name'
  | 'isAdmin'
  | 'isPending'
  | 'recipeCount'
  | 'ratingCount'
  | 'image'
>;

export enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
  PENDING = 'pending',
}
