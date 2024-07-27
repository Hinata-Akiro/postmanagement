import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRoles } from '../enums/role.enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true, strict: false, toJSON: { virtuals: true } })
export class User {
  @Prop({ type: MongooseSchema.Types.String })
  firstName: string;

  @Prop({ type: MongooseSchema.Types.String })
  lastName: string;

  @Prop({ type: MongooseSchema.Types.String, index: true })
  email: string;

  @Prop({ type: MongooseSchema.Types.String })
  password: string;

  @Prop({ required: true, type: MongooseSchema.Types.String })
  image?: string;

  @Prop({
    type: MongooseSchema.Types.String,
    enum: UserRoles,
    default: UserRoles.user,
  })
  role: UserRoles;

  @Prop({ type: MongooseSchema.Types.Boolean, default: true })
  active: boolean;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
