import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

jest.mock('./guards/gql-auth.guard');

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    biometric: jest.fn(),
    setBiometric: jest.fn(),
  };

  const mockGqlAuthGuard = {
    canActivate: jest.fn().mockImplementation((context: ExecutionContext) => {
      const gqlContext = GqlExecutionContext.create(context);
      gqlContext.getContext().req = { user: { id: '1' } };
      return true;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: GqlAuthGuard,
          useValue: mockGqlAuthGuard,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockSignUpInput = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    const mockResponse = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
      token: 'jwt-token',
    };

    it('should register a new user', async () => {
      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await resolver.register(mockSignUpInput);

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(mockSignUpInput);
    });
  });

  describe('login', () => {
    const mockLoginInput = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockResponse = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
      token: 'jwt-token',
    };

    it('should login user', async () => {
      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await resolver.login(mockLoginInput);

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginInput);
    });
  });

  describe('biometricLogin', () => {
    const mockBiometricInput = {
      biometric_key: 'thumb123',
    };

    const mockResponse = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
      token: 'jwt-token',
    };

    it('should login with biometric', async () => {
      mockAuthService.biometric.mockResolvedValue(mockResponse);

      const result = await resolver.biometricLogin(mockBiometricInput);

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.biometric).toHaveBeenCalledWith(mockBiometricInput.biometric_key);
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

    const mockResponse = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
      token: 'jwt-token',
    };

    it('should set biometric data', async () => {
      mockAuthService.setBiometric.mockResolvedValue(mockResponse);

      const result = await resolver.setBiometric(mockBiometricInput, { id: '1' });

      expect(result).toEqual(mockResponse);
      expect(mockAuthService.setBiometric).toHaveBeenCalledWith('1', mockBiometricInput);
    });
  });
});
