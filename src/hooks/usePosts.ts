import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPost, deletePost, fetchPosts, UpdatePost } from "../actions/api";
import toast from "react-hot-toast";
import { OrderType } from "../types";

export function usePost() {
  const queryClient = useQueryClient();

  // fetching posts query
  const postQuery = (
    page: number,
    pageSize: number,
    search: string,
    order: OrderType
  ) =>
    useQuery({
      queryFn: () => fetchPosts({ page, pageSize, search, order }),
      queryKey: ["posts", page, pageSize, search, order],
      staleTime: Infinity,
      retry: 1,
    });

  // adding post mutation
  const addPostMutation = () =>
    useMutation({
      mutationFn: addPost,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post added successfully!");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to add post"
        );
      },
    });

  // deleting post mutation
  const deletePostMutation = () =>
    useMutation({
      mutationFn: deletePost,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post deleted successfully!");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete post"
        );
      },
    });

  // updating/editing post mutation
  const updatePostMutation = () =>
    useMutation({
      mutationFn: UpdatePost,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post updated successfully!");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Failed to update post"
        );
      },
    });

  return {
    postQuery,
    addPostMutation,
    deletePostMutation,
    updatePostMutation,
  };
}
