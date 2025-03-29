/* eslint-disable @typescript-eslint/no-unsafe-call */
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}

@InputType()
export class BiometricInput {
  @Field()
  @IsString()
  right_thumb_finger: string;

  @Field()
  @IsString()
  right_index_finger: string;

  @Field()
  @IsString()
  right_middle_finger: string;

  @Field()
  @IsString()
  right_ring_finger: string;

  @Field()
  @IsString()
  right_short_finger: string;

  @Field()
  @IsString()
  left_thumb_finger: string;

  @Field()
  @IsString()
  left_index_finger: string;

  @Field()
  @IsString()
  left_middle_finger: string;

  @Field()
  @IsString()
  left_ring_finger: string;

  @Field()
  @IsString()
  left_short_finger: string;
}

@InputType()
export class BiometricLoginInput {
  @Field()
  @IsString()
  biometric_key: string;
}