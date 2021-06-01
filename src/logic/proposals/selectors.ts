import { BigNumber } from '@ethersproject/bignumber';
import { Proposal, Proposals, ProposalType } from '../../chain-data';
import { computePercentage } from '../../contracts';

export const voteSliderSelector = (proposal: Proposal) => {
  const minAcceptanceQuorum = proposal.minAcceptQuorum.toNumber();
  const forPercentage = computePercentage(proposal.yea, proposal.votingPower);
  const againstPercentage = computePercentage(proposal.nay, proposal.votingPower);

  return {
    minAcceptanceQuorum,
    forPercentage,
    againstPercentage,
    // NOTE: We rely on proposal.supportRequired to be 50% because we don't expect it to change
    // See: https://api3workspace.slack.com/archives/C020RCCC3EJ/p1621103766015200
    status: forPercentage > againstPercentage && forPercentage > minAcceptanceQuorum ? 'passing' : 'failing',
  };
};

export const proposalDetailsSelector = (proposals: Proposals | null, type: ProposalType, id: string) => {
  if (!proposals) return null;

  const proposal = proposals[type].find((p) => p.voteId.toString() === id);
  return proposal ?? null;
};

export const getProposalByTypeAndIdSelector = (proposals: Proposals, type: ProposalType, id: BigNumber) =>
  proposals[type].find((p) => p.voteId === id);
