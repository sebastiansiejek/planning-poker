import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

import type { DatabaseProvider } from '@/shared/types/types';

type SessionContext = {
  token: JWT;
  user: User;
};
type SessionStrategyFunction = (
  session: Session,
  context: SessionContext,
) => Session;
type JwtStrategyFunction = (token: JWT, user: User) => JWT;

export class AuthSessionStrategy {
  static handleSessionWithFirebase(
    session: Session,
    { token }: SessionContext,
  ) {
    if (session?.user && token?.sub) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    }

    return session;
  }

  static handleSessionWithPostgres(session: Session, { user }: SessionContext) {
    if (user?.id) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    }

    return session;
  }

  static handleJWTWithFireBase(token: JWT, user: User) {
    if (process.env.DATABASE_PROVIDER === 'firebase' && user) {
      // eslint-disable-next-line no-param-reassign
      token.sub = user.id;

      return token;
    }

    return token;
  }

  static handleJWTDefault(token: JWT) {
    return token;
  }

  private sessionStrategies: Record<DatabaseProvider, SessionStrategyFunction>;

  private jwtStrategies: Record<DatabaseProvider, JwtStrategyFunction>;

  constructor() {
    this.sessionStrategies = {
      firebase: AuthSessionStrategy.handleSessionWithFirebase,
      postgres: AuthSessionStrategy.handleSessionWithPostgres,
    };

    this.jwtStrategies = {
      firebase: AuthSessionStrategy.handleJWTWithFireBase,
      postgres: AuthSessionStrategy.handleJWTDefault,
    };
  }

  handleSession(session: Session, context: SessionContext): Session {
    const databaseProvider = process.env.DATABASE_PROVIDER;

    const strategy = this.sessionStrategies[databaseProvider];

    return strategy(session, context);
  }

  handleJWT(token: JWT, user: User): JWT {
    const databaseProvider = process.env.DATABASE_PROVIDER;

    const strategy = this.jwtStrategies[databaseProvider];

    return strategy(token, user);
  }
}
