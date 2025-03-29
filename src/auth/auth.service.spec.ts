import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    biometric: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedPassword',
    };

    const mockSignUpInput = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await service.register(mockSignUpInput);

      expect(result).toEqual({
        user: mockUser,
        token: 'jwt-token',
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockSignUpInput.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockSignUpInput.password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(mockSignUpInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    const mockLoginInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(mockLoginInput);

      expect(result).toEqual({
        user: mockUser,
        token: 'jwt-token',
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockLoginInput.email },
      });
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(mockLoginInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('biometric', () => {
    const mockBiometric = {
      owner: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    };

    it('should login with biometric successfully', async () => {
      mockPrisma.biometric.findFirst.mockResolvedValue(mockBiometric);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.biometric('thumb123');

      expect(result).toEqual({
        user: mockBiometric.owner,
        token: 'jwt-token',
      });
      expect(mockPrisma.biometric.findFirst).toHaveBeenCalled();
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if biometric is invalid', async () => {
      mockPrisma.biometric.findFirst.mockResolvedValue(null);

      await expect(service.biometric('invalid')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('setBiometric', () => {
    const mockBiometricInput = {
      right_thumb_finger: 'thumb123',
      right_index_finger: 'index123',
      right_middle_finger: 'middle123',
      right_ring_finger: 'ring123',
      right_short_finger: 'short123',
      left_thumb_finger: 'leftthumb123',
      left_index_finger: 'leftindex123',
      left_middle_finger: 'leftmiddle123',
      left_ring_finger: 'leftring123',
      left_short_finger: 'leftshort123',
    };

    const mockBiometric = {
      owner: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
    };

    it('should set biometric data successfully', async () => {
      mockPrisma.biometric.findFirst.mockResolvedValue(null);
      mockPrisma.biometric.create.mockResolvedValue(mockBiometric);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.setBiometric('1', mockBiometricInput);

      expect(result).toEqual({
        user: mockBiometric.owner,
        token: 'jwt-token',
      });
      expect(mockPrisma.biometric.findFirst).toHaveBeenCalled();
      expect(mockPrisma.biometric.create).toHaveBeenCalled();
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw BadRequestException if biometric already exists', async () => {
      mockPrisma.biometric.findFirst.mockResolvedValue(mockBiometric);

      await expect(service.setBiometric('1', mockBiometricInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
