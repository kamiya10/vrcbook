import { State, Status } from '@/components/user/status-badge';
import { TrustRanks } from '@/components/user/trust-rank';

import { normalizeSymbols } from './utils';

import type { LimitedUser, User } from './models/user';

export const getUserTrustRank = (user: LimitedUser) => {
  if (user.tags.includes('system_trust_veteran')) {
    return TrustRanks.TrustedUser;
  }
  if (user.tags.includes('system_trust_trusted')) {
    return TrustRanks.KnownUser;
  }
  if (user.tags.includes('system_trust_known')) {
    return TrustRanks.User;
  }
  if (user.tags.includes('system_trust_basic')) {
    return TrustRanks.NewUser;
  }

  return TrustRanks.Visitor;
};

export const getUserStatus = (user: LimitedUser) => {
  switch (user.status) {
    case 'join me':
      return Status.JoinMe;
    case 'active':
      return Status.Active;
    case 'ask me':
      return Status.AskMe;
    case 'busy':
      return Status.DoNotDistrub;
    default:
      return Status.Offline;
  }
};

export const getUserStatusDescription = (user: LimitedUser) => {
  if (user.statusDescription) return normalizeSymbols(user.statusDescription);

  switch (getUserStatus(user)) {
    case Status.JoinMe:
      return 'Join Me';
    case Status.Active:
      return 'Active';
    case Status.AskMe:
      return 'Ask Me';
    case Status.DoNotDistrub:
      return 'Do Not Distrub';
    case Status.Offline:
      return 'Offline';
  }
};

export const getUserState = (user: User) => {
  switch (user.state) {
    case 'active':
      return State.Active;
    case 'online':
      return State.InGame;
    default:
      return State.Offline;
  }
};

export const getLimitedUserState = (user: LimitedUser) => {
  if (user.location.startsWith('wrld')) {
    return State.InGame;
  }

  if (user.status == Status.Offline) {
    return State.Offline;
  }

  return State.Active;
};
