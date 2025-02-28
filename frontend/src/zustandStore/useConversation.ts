import { create } from "zustand";
import {Conversation, MessageType} from "../types/types"


interface ConversationState {
  selectedConversation: Conversation | null;
  setSelectedConversation: (selectedConversation: Conversation | null) => void;
  messages: MessageType[];
  setMessages: (messages: MessageType[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation: Conversation | null) => set({ selectedConversation }),
  messages: [],
  setMessages: (messages: MessageType[]) => set({ messages })
}));

export default useConversation;
