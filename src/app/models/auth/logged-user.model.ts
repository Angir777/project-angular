import { User } from '../user/user';
import { Token } from './token';

/**
 * Model użytkownika z dodatkiem informacji o tokenie.
 */
export class LoggedUser extends User {
  token: Token | null = null;
  tokenType: string | null = null;
}
