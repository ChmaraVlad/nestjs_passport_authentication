import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // This strategy requires some initialization, so we do that by passing in an options object in the super() call
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // Passport first verifies the JWT's signature and decodes the JSON. It then invokes our validate() method
  // passing the decoded JSON as its single parameter. Based on the way JWT signing works,
  // we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.
  async validate(payload) {
    return { userId: payload.sub, username: payload.username };
    // It's also worth pointing out that this approach leaves us room ('hooks' as it were) to inject other business logic into the process.
    // For example, we could do a database lookup in our validate() method to extract more information about the user,
    // resulting in a more enriched user object being available in our Request.
    // This is also the place we may decide to do further token validation, such as
    // looking up the userId in a list of revoked tokens, enabling us to perform token revocation.
    // The model we've implemented here in our sample code is a fast, "stateless JWT" model,
    // where each API call is immediately authorized based on the presence of a valid JWT,
    // and a small bit of information about the requester (its userId and username) is available in our Request pipeline.
  }
}
