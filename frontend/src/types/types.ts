
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
  shouldShake ?: boolean;
  _id: string;
  message: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  fileUrl ?: string;
}

export interface UseGetMessagesReturn {
loading: boolean;
messages: MessageType[];
}

export interface MyComponentProps {
  visibility: boolean;
  conversation : Conversation;
}

export interface GroupedMessages {
  date: string;
  messages: MessageType[];
}

export interface UseGetConversation {
loading: boolean;
auramicAi?:string;
conversations: Conversation[];
}

export interface MessageTextSmallProps {
  message: MessageType;
}
