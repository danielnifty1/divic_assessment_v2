/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Resolver, Mutation, Args,Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';

import { AuthResponse } from './dto/sign-up-Response';
import {
  BiometricInput,
  BiometricLoginInput,
  LoginInput,
  SignUpInput,
} from './dto/auth-input';
import { UseGuards } from '@nestjs/common';

import { CurrentUser } from './decorators/current-user.decorator';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  //Register new user
  @Mutation(() => AuthResponse)
  register(@Args('input') input: SignUpInput) {
    return this.authService.register(input);
  }

  // Login (Standard Login)
  @Mutation(() => AuthResponse)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  // Login (Biometric Login)
  @Mutation(() => AuthResponse)
  // @UseGuards(JwtAuthGuard)
  biometricLogin(@Args('input') input: BiometricLoginInput) {
    return this.authService.biometric(input.biometric_key);
  }

  // set Biometric Key for User
  @Mutation(() => AuthResponse)
  @UseGuards(GqlAuthGuard)
  setBiometric(@Args('input') input: BiometricInput, @CurrentUser() user: any) {
    return this.authService.setBiometric(user.id, input);
  }
}
