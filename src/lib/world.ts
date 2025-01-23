import type { Instance } from './models/world';

export const getInstanceTypeFromId = (id: string) => {
  if (id.includes('~hidden(')) {
    return 'Friends+';
  }

  if (id.includes('~friends(')) {
    return 'Friends';
  }

  if (id.includes('~private(')) {
    if (id.includes('~canRequestInvite')) {
      return 'Invite+';
    }

    return 'Invite';
  }

  return 'Public';
};

export const getInstanceType = (instance: Instance) => {
  if (instance.type == 'hidden') {
    return 'Friends+';
  }

  if (instance.type == 'friends') {
    return 'Friends';
  }

  if (instance.type == 'private') {
    if (instance.canRequestInvite) {
      return 'Invite+';
    }

    return 'Invite';
  }

  if (instance.type == 'group') {
    if (instance.groupAccessType == 'public') return 'Group Public';
    if (instance.groupAccessType == 'plus') return 'Group+';

    return 'Group';
  }

  return 'Public';
};
