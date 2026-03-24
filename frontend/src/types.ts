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
  postsCount?: number;
  allowMessagesFrom?: 'everyone' | 'friends' | 'nobody';
  photos?: Photo[];
  posts?: Post[];
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
  createdAt: string;
  members?: OrganizationMember[];
  posts?: Post[],
  longitude: string,
  latitude: string
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
}

export interface Chat {
  id: number;
  name?: string;
  type: 'personal' | 'group';
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  otherParticipant?: User;
  participants?: ChatParticipant[];
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
  username: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

