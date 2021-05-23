import { BigNumber, ethers } from 'ethers';
import type localhostDao from '../contract-deployments/localhost-dao.json';

type ContractsInfo = typeof localhostDao['contracts'];

export interface PendingUnstake {
  amount: BigNumber;
  deadline: string;
  scheduledFor: string;
}

export interface DashboardState {
  allowance: BigNumber;
  annualApy: number;
  annualInflationRate: number;
  balance: BigNumber;
  ownedTokens: BigNumber;
  pendingUnstake: PendingUnstake | string;
  stakeTarget: BigNumber;
  totalStaked: BigNumber;
  totalStakedPercentage: number;
  userStake: BigNumber;
  withdrawable: BigNumber;
}

export interface ProposalMetadata {
  targetSignature: string;
  description: string;
}

export type VoterState = 0 | 1 | 2; // Absent, Yea, Nay
export type ProposalType = 'primary' | 'secondary';

export interface Proposal {
  voteId: ethers.BigNumber;
  creator: string;
  metadata: ProposalMetadata;
  startDate: Date;
  voterState: VoterState;
  open: boolean;
  executed: boolean;
  supportRequired: BigNumber;
  minAcceptQuorum: BigNumber;
  yea: BigNumber;
  nay: BigNumber;
  votingPower: BigNumber;
  deadline: Date;
  startDateRaw: BigNumber;
  type: ProposalType;
}

export interface ProposalState {
  delegationAddress: string;
  primary: {
    proposals: Proposal[];
  };
  secondary: {
    proposals: Proposal[];
  };
}

export interface ChainData {
  provider: ethers.providers.Web3Provider | null;
  userAccount: string;
  networkName: string;
  chainId: string;
  contracts: ContractsInfo | null;
  latestBlock: number;
  dashboardState: DashboardState | null;
  proposalState: ProposalState | null;
  transactions: ethers.ContractTransaction[];
}

interface SettableChainData extends ChainData {
  setChainData: (newChainData: Partial<ChainData>) => void;
}

export const initialChainData: ChainData = {
  provider: null,
  userAccount: '',
  networkName: '',
  chainId: '',
  contracts: null,
  latestBlock: 0,
  dashboardState: null,
  proposalState: null,
  transactions: [],
};

export const initialSettableChainData: SettableChainData = { ...initialChainData, setChainData: () => {} };
