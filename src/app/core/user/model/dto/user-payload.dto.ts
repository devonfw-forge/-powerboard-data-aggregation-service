import { User } from '../entities/user.entity';

export class UserPayload implements Pick<User, 'id' | 'username' | 'role'> {
  id!: string;
  username!: string;
  role!: number;
}
