import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { LikeResponse } from "../types/types";

const likePostAPI = async (postId: string, like: boolean): Promise<LikeResponse> => {
  const response = await fetch(`/api/likes/${postId}`, {
    method: like ? "POST" : "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to update like status");
  return response.json();
};

export const useLikePost = (postId: string, initialLiked: boolean, initialLikesCount: number) => {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likesCount, setLikesCount] = useState<number>(initialLikesCount);

  const mutation = useMutation({
    mutationFn: (newLiked: boolean) => likePostAPI(postId, newLiked),
    onMutate: async (newLiked) => {
      // Optimistic UI update
      setLiked(newLiked);
      setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    },
    onError: (error, newLiked) => {
      console.error("Like action failed:", error);
      // Revert state on failure
      setLiked(!newLiked);
      setLikesCount((prev) => (!newLiked ? prev + 1 : prev - 1));
    },
  });

  const toggleLike = useCallback(() => {
    mutation.mutate(!liked);
  }, [liked, mutation]);

  return { liked, likes_Count:likesCount, toggleLike, isLoading: mutation.isPending };
};
