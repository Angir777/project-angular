import { User } from '../user/user';
import { Token } from './token';

export class LoggedUser extends User {
  token: Token | null = null;
  tokenType: string | null = null;
}
