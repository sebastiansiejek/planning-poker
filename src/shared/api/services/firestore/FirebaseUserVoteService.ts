import type { UserVoteService } from '@/shared/factories/UserVoteServiceFactory';

export class FirebaseUserVoteService implements UserVoteService {
  // TODO: implement that
  getVotedUsers: UserVoteService['getVotedUsers'] = () => {
    return Promise.resolve([]);
  };
}
