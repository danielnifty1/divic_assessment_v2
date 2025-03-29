/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@ObjectType()
export class SignUpResponse {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  biometric_key?: string;


  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  id: string;
}

@ObjectType()
export class AuthResponse {
  @Field(()=>SignUpResponse)
  user: SignUpResponse;

  @Field()
  token: string;
}
