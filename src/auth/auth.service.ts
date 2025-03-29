/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { LoginInput } from './dto/auth-input';

interface SignUpInput {
  email: string;
  password: string;
  name: string;
}

interface BiometricInput {
  right_thumb_finger: string;
  right_index_finger: string;
  right_middle_finger: string;
  right_ring_finger: string;
  right_short_finger: string;
  left_thumb_finger: string;
  left_index_finger: string;
  left_middle_finger: string;
  left_ring_finger: string;
  left_short_finger: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  // creating account
  async register(SignUpInput: SignUpInput) {
    try {
      // check if user exists
      const email = SignUpInput.email;
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }
      // hash password
      const hashedPassword = await bcrypt.hash(SignUpInput.password, 10);

      // create user data
      const data = {
        password: hashedPassword,
        email: SignUpInput.email,
        name: SignUpInput.name,
      };

      const user = await this.prisma.user.create({
        data: data,
      });

      // generate token
      const token = this.generateToken(user);

      return {
        user: user,
        token: token,
      };
    } catch (error) {
      console.error('Registration service error:', error);
      throw error;
    }
  }

  // login
  async login(LoginInput: LoginInput) {
    try {
      // check if user exists
      const email = LoginInput.email;
      const password = LoginInput.password;
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException('Invalid Login Credentials');
      }

      // compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Invalid Credentials', error);
    }
  }

  // biometric login
  async biometric(biometric_key: string) {
    try {
      // Check all possible finger biometrics

      const biometric = await this.prisma.biometric.findFirst({
        where: {
          OR: [
            { right_thumb_finger: biometric_key },
            { right_index_finger: biometric_key },
            { right_middle_finger: biometric_key },
            { right_ring_finger: biometric_key },
            { right_short_finger: biometric_key },
            { left_thumb_finger: biometric_key },
            { left_index_finger: biometric_key },
            { left_middle_finger: biometric_key },
            { left_ring_finger: biometric_key },
            { left_short_finger: biometric_key },
          ],
        },
        include: {
          owner: true,
        },
      });

      if (!biometric || !biometric.owner) {
        throw new UnauthorizedException('Biometric validation failed');
      }

      // generate token
      const token = this.generateToken(biometric.owner);
      // return user and token
      return { user: biometric.owner, token };
    } catch (error) {
      throw new UnauthorizedException('Biometric validation failed', error);
    }
  }

  async setBiometric(userId: string, input: BiometricInput) {
    try {
      // Check if any of the biometric keys are already in use
      const existingBiometric = await this.prisma.biometric.findFirst({
        where: {
          OR: [
            { right_thumb_finger: input.right_thumb_finger },
            { right_index_finger: input.right_index_finger },
            { right_middle_finger: input.right_middle_finger },
            { right_ring_finger: input.right_ring_finger },
            { right_short_finger: input.right_short_finger },
            { left_thumb_finger: input.left_thumb_finger },
            { left_index_finger: input.left_index_finger },
            { left_middle_finger: input.left_middle_finger },
            { left_ring_finger: input.left_ring_finger },
            { left_short_finger: input.left_short_finger },
          ],
        },
      });

      if (existingBiometric) {
        throw new BadRequestException(
          'One or more biometric keys are already in use',
        );
      }

      // Create new biometric record
      const biometric = await this.prisma.biometric.create({
        data: {
          ...input,
          owner: {
            connect: { id: userId },
          },
        },
        include: {
          owner: true,
        },
      });

        // check if biometric record was created
      if (!biometric.owner) {
        throw new BadRequestException('Failed to create biometric record');
      }
      // generate token
      const token = this.generateToken(biometric.owner);
      // return user and token
      return { user: biometric.owner, token };
    } catch (error) {
      // throw error
      throw new BadRequestException('Failed to create biometric record', error);
    }
  }

  generateToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
