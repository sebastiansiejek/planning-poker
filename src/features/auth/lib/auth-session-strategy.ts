import type { Session, User } from 'next-auth';

type SessionContext = {
  user: User;
};

export class AuthSessionStrategy {
  static handleSession(session: Session, { user }: SessionContext) {
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

  handleSession(session: Session, context: SessionContext): Session {
    return AuthSessionStrategy.handleSession(session, context);
  }
}
