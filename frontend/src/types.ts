export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  work?: string;
  about?: string;
  avatar?: string;
  role?: 'admin' | 'user';
  isBanned?: number;
  canCreateGovernmentOrganizations?: number;
  postsCount?: number;
  allowMessagesFrom?: 'everyone' | 'friends' | 'nobody';
  photos?: Photo[];
  posts?: Post[];
  rang?: Rang;
  balance: number;
  energy: number;
  resources: Resource[];
}

export interface Rang {
  id: number;
  name: string;
  thumbnailUrl: string;
  orderNumber: number;
}

export interface Photo {
  id: number;
  photoUrl: string;
  createdAt: string;
}

export interface Post {
  id: number;
  content: string;
  image?: string;
  authorId?: number;
  organizationId?: number;
  repostOfId?: number;
  authorUsername?: string;
  authorAvatar?: string;
  authorFirstName?: string;
  authorLastName?: string;
  organizationName?: string;
  organizationAvatar?: string;
  likesCount: number;
  commentsCount: number;
  repostsCount?: number;
  isLiked: number;
  createdAt: string;
  comments?: Comment[];
  repostedPostId?: number;
  repostedContent?: string;
  repostedImage?: string;
  repostedAuthorUsername?: string;
  repostedAuthorAvatar?: string;
  repostedAuthorFirstName?: string;
  repostedAuthorLastName?: string;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  username: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  adminId: number;
  adminUsername?: string;
  membersCount: number;
  defaultCanPost?: number;
  defaultCanComment?: number;
  isPrivate?: number;
  orgType?: string;
  parentId?: number | null;
  parentOrg?: { id: number; name: string; orgType?: string } | null;
  subOrganizations?: Organization[];
  organization_icon_id?: number;
  organization_cover_id?: number;
  presetCoverUrl?: string;
  typeDefaultCoverUrl?: string;
  imageUrl?: string;
  groupChatId?: number | null;
  isInGroupChat?: boolean;
  createdAt: string;
  members?: OrganizationMember[];
  posts?: Post[],
  longitude: string,
  latitude: string,
  balance: number,
  energy: number,
  resources: Resource[]
}

export interface OrganizationMember {
  id: number;
  organizationId: number;
  userId: number;
  role: 'admin' | 'moderator' | 'member';
  canPost?: number;
  canComment?: number;
  isBlocked?: number;
  username?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  rang?: Rang;
}

export interface Chat {
  id: number;
  name?: string;
  type: 'personal' | 'group';
  avatar?: string;
  organizationId?: number | null;
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  otherParticipant?: User;
  participants?: ChatParticipant[];
  countNotReaded: number;
  countParticipants: number;
  orgType?: string;
}

export interface ChatParticipant {
  id: number;
  chatId: number;
  userId: number;
  username?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

export interface Message {
  id: number;
  chatId: number;
  userId: number;
  content: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileDeleted?: number;
  fileDeletedAt?: string;
  isDeleted?: number;
  deletedAt?: string;
  username: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  isReaded: number;
  isResponse: number;
  isForward: number;
  responseFromMessageText: string | null;
  responseFromMessageAuthor: string | null;
  responseFromMessageId: string | null;
  responseMessageFile?: string;
  responseMessageFileType?: string;
  rangImageUrl: string | null;
}

export interface Resource {
  id: number;
  number: number;
  name: string;
  imageUrl: string;
  countNeedEnergy: number;
  countNeedMoney: number;
}

export interface SimpleItem {
  id: number;
  number: number;
  name: string;
  imageUrl: string;
  countNeedEnergy: number;
  countNeedMoney: number;
  needResourceId: number;
  countNeedResource: number; 
}

export interface CompoundItem {
  id: number;
  number: number;
  name: string;
  imageUrl: string;
  parts: CompoundItemPartRow[]
}

export interface CompoundItemPartRow {
  id?: number;
  compoundItemId?: number;
  partItemId: number;
  countNeed: number;
}