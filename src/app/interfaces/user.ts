import { Status } from './../types/user';

export interface User {
  nick: string;
  subnick?: string;
  age?: number;
  email: string;
  friend?: boolean;
  uid: any;
  status: Status;
  avatar?: string;
}
