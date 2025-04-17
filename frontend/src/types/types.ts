
import { ReactNode } from 'react';

export interface UserJoinedData {
  video: boolean;
  username: string;
  id: string;
  userId: string;
}
export interface UserJoinedDataRequest {
  video: boolean;
  username: string;
  userId: string;
  room: string;
}

export interface IncommingCallData {
  video: boolean;
  username: string;
  from: string;
  offer: RTCSessionDescriptionInit;
}

export interface CallAcceptedData {
  from: string;
  ans: RTCSessionDescriptionInit;
}

export interface NegoNeededData {
  from: string;
  offer: RTCSessionDescriptionInit;
}

export interface NegoNeedFinalData {
  ans: RTCSessionDescriptionInit;
}

export interface JoinRoomData {
  email: string;
  room: string;
}

export interface Conversation {
  _id: string;
  username: string;
  fullname: string;
  profilePic: string;
  auramicAiCall?: string;
}

export interface MessageType {
  shouldShake?: boolean;
  _id: string;
  message: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  fileUrl?: string;
}

export interface UseGetMessagesReturn {
  loading: boolean;
  messages: MessageType[];
}

export interface MyComponentProps {
  visibility: boolean;
  conversation: Conversation;
}

export interface GroupedMessages {
  date: string;
  messages: MessageType[];
}

export interface UseGetConversation {
  loading: boolean;
  auramicAi?: string;
  conversations: Conversation[];
}

export interface MessageTextSmallProps {
  message: MessageType;
}
export interface PostImage {
  _id: string;
  url: string;
  alt?: string;
}

export interface FeedPostCardProps {
  postImages: PostImage[];
  text: string;
  fullname: string;
  username: string;
  profilePic: string;
  createdAt: string;
  commentsCount: number;
  likesCount: number;
  postId: string;
  isLiked: boolean;
  userId: string;
}
export interface User2 {
  _id: string;
  username: string;
  profilePic: string;
}

export interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId: User2;
  postId: string;
}

export interface CommentModalProps {
  postImages: { url: string; alt?: string }[];
  comments: Comment[];
  onClose: () => void;
  onAddComment: (comment: string) => void;
}
export interface AddStoryCardProps {
  mediaUrl: string;
  userImage: string;
  username: string;
  width: string;
  isVideo: boolean;
}
export interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  textColor: string;
  children: React.ReactNode;
}
export interface ConfirmCardProps {
  userById: string;
  userImage: string;
  userName: string;
  fullName: string;
}
export interface RequestCardProps {
  userImage: string;
  userId: string;
  userName: string;
  fullName: string;
  onConfirm: (userId: string) => void;
}
export interface Story {
  _id: string;
  userId: {
    _id: string;
    profilePic: string;
    username: string;
  };
  caption?: string;
  file: { url: string; alt: string }[];
  commentAllowed: boolean;
  expiresAt: string;
}
export interface FeedContextValue {
  fetchFeedPosts: any[];
  loading: boolean;
  error: string | null;
  fetchFeed: () => Promise<void>;
}
export interface KeyValuePair {
  key: string;
  value: string;
}

export interface SocketContextValue {
  selectedTextUser: KeyValuePair | null;
  setSelectedTextUser: (value: KeyValuePair | null) => void;
  // userNotification: MessageNotification | null;
  // setUserNotification: (value: MessageNotification | null) => void;
}


export interface ThemeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  textColor: string;
  setTextColor: (color: string) => void;
}
export interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  profilePic?: string;
  coverImage?: string;
  private: boolean | false;
  bio?: string;
  followersCount: number;
  followingCount: number;
  followers: UserKnowns[];
  following: UserKnowns[];
  followRequests: UserKnowns[];
}
export interface UserKnowns {
  _id: string;
  fullname: string;
  username: string;
  profilePic: string;
  auramicAiCall?: string;
  isFollowing?: boolean;
}
export interface UserContextValue {
  user: User | null;
  stories: Story[];
  loading: boolean;
  refresh: boolean;
  countPosts: number | 0;
  error: string | null;
  auramicAiId: string | null;
  confirmedFriends: UserKnowns[];
  fetchUserData: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface LikeResponse {
  success: boolean;
  liked: boolean;
}
export interface LoginData {
  username: string;
  password: string;
}
export interface UseLogout {
  loading: boolean;
  logout: () => Promise<void>;
}
export interface SignupData {
    fullname: string;
    username: string;
    password: string;
    confirmPassword: string;
}
export interface Post {
  _id: string;
  text: string;
  file: File[];
  user: {
    _id: string;
    fullname: string;
    username: string;
    profilePic: string;
  };
  createdAt: string;
  commentsCount: number;
  likesCount: number;
  isLiked?: boolean;
}

export interface File {
  _id: string;
  url: string;
}
export interface NotificationContextProviderProps {
    children: ReactNode;
    maxNotifications?: number;
    notificationTimeout?: number;
}
export interface MessageNotification {
    _id: string;
    createdAt: string;
    fileUrl?: string | null;
    message: string;
    receiverId: string;
    senderId: string;
    updatedAt: string;
}
export interface EnhancedNotification extends MessageNotification {
    profilePic?: string;
    username?: string;
    fullname?: string;
    isUpdated?: boolean;
    isRead?: boolean;
}
export interface NotificationContextValue {
    notifications: EnhancedNotification[];
    clearNotifications: () => void;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
}