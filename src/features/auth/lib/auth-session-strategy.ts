import type { Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

import { getDatabaseProvider } from '@/shared/lib/database-provider';
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
  private readonly sessionStrategies: Record<
    DatabaseProvider,
    SessionStrategyFunction
  >;
  private readonly jwtStrategies: Record<DatabaseProvider, JwtStrategyFunction>;

  constructor() {
    this.sessionStrategies = {
      firebase: AuthSessionStrategy.handleSessionWithFirebase,
      prisma: AuthSessionStrategy.handleSessionWithPrisma,
    };

    this.jwtStrategies = {
      firebase: AuthSessionStrategy.handleJWTWithFireBase,
      prisma: AuthSessionStrategy.handleJWTDefault,
    };
  }

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

  static handleSessionWithPrisma(session: Session, { user }: SessionContext) {
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
    if (getDatabaseProvider() === 'firebase' && user) {
      token.sub = user.id;

      return token;
    }

    return token;
  }

  static handleJWTDefault(token: JWT) {
    return token;
  }

  handleSession(session: Session, context: SessionContext): Session {
    const databaseProvider = getDatabaseProvider();

    const strategy = this.sessionStrategies[databaseProvider];

    return strategy(session, context);
  }

  handleJWT(token: JWT, user: User): JWT {
    const databaseProvider = getDatabaseProvider();

    const strategy = this.jwtStrategies[databaseProvider];

    return strategy(token, user);
  }
}
