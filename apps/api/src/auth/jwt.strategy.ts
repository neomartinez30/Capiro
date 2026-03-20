import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { AuthenticatedUser } from './types';

interface CognitoJwtPayload {
  sub: string;
  email: string;
  'custom:tenant_id': string;
  'custom:role': string;
  'custom:user_id': string;
  'custom:first_name': string;
  'custom:last_name': string;
  token_use: string;
  iss: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const cognitoRegion = configService.getOrThrow<string>('COGNITO_REGION');
    const userPoolId = configService.getOrThrow<string>('COGNITO_USER_POOL_ID');
    const issuer = `https://cognito-idp.${cognitoRegion}.amazonaws.com/${userPoolId}`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuer}/.well-known/jwks.json`,
      }),
    });
  }

  validate(payload: CognitoJwtPayload): AuthenticatedUser {
    if (payload.token_use !== 'id') {
      throw new UnauthorizedException('Invalid token type');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      tenantId: payload['custom:tenant_id'],
      role: payload['custom:role'],
      userId: payload['custom:user_id'],
      firstName: payload['custom:first_name'],
      lastName: payload['custom:last_name'],
    };
  }
}
