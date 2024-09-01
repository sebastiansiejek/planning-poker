export type VotingCardProps = {
  isDisabled?: boolean;
  option: string;
  voteValue: string;
  setVoteValue: (value: string) => void;
};
