import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/entities/User';
import mongoose, { Schema, Document } from 'mongoose';

// interface UserDocument extends User, Document {}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.model<User>('Users', UserSchema);
// const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export class MongoUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user
      ? new User(user.id, user.username, user.email, user.password)
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user
      ? new User(user.id, user.username, user.email, user.password)
      : null;
  }

  async create(user: User): Promise<User> {
    const newUser = new UserModel(user);
    await newUser.save();
    return new User(
      newUser.id,
      newUser.username,
      newUser.email,
      newUser.password,
    );
  }
}
