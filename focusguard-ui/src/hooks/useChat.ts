import {
  useMutation,
} from "@tanstack/react-query";

import {
  sendChatMessage,
} from "../api/chat.api";

export const useChat = () => {
  return useMutation({
    mutationFn: sendChatMessage,
  });
};