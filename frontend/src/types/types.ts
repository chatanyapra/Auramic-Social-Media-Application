
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
export interface FeedPostCardProps {
  postImages: string[]; // Array of image URLs
  text: string; // Post text
  userId: string; // Full name of the post creator
  fullname: string; // Full name of the post creator
  username: string; // Username of the post creator
  profilePic: string; // Profile picture of the post creator
  createdAt: string; // Timestamp of the post
  commentsCount: number; // Number of comments
  likesCount: number; // Number of likes
  postId: string; // Unique ID of the post
  isLiked?: boolean;
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
  postImages: string[]; // Array of image URLs
  comments: Comment[]; // Array of comment objects
  onClose: () => void; // Function to close the modal
  onAddComment: (comment: string) => void; // Function to add a new comment
}
export interface AddStoryCardProps {
  width?: string;
  backVideo: string;
  userImage: string;
  username: string;
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
  setSelectedTextUser: (pair: KeyValuePair | null) => void;
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
  url: string;
}