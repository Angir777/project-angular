import { User } from "../user/user";
import { Token } from "./token";

/**
 * Token zalogowanego użytkownika.
 */
export class AuthUser extends User {
  token: Token | null = null;
  tokenType: string | null = null;
}
