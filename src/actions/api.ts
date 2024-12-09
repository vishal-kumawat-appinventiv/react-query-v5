import { OrderType } from "../types";

// fetching posts with pagination action
export const fetchPosts = async ({
  page = 1,
  pageSize,
  search,
  order,
}: {
  page: number;
  pageSize: number;
  search: string;
  order: OrderType;
}) => {
  const startIndex = (page - 1) * pageSize;

  let url = `https://dummyjson.com/posts/search?q=${search}&limit=${pageSize}&skip=${startIndex}`;

  if (order !== "none") {
    url += `&sortBy=title&order=${order}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts. Status: ${response.status}`);
  }

  const data = await response.json();

  if (!data || !data.posts) {
    throw new Error("No posts data received");
  }

  const totalPages = Math.ceil(data.total / pageSize);
  const currentPage = page;

  return {
    posts: data.posts,
    totalPages: totalPages,
    currentPage: currentPage,
  };
};

// adding post action
export const addPost = async ({ title }: { title: string }) => {
  const response = await fetch("https://dummyjson.com/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      userId: Math.floor(Math.random() * (10 - 1 + 1)) + 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add post. Status: ${response.status}`);
  }

  return await response.json();
};

// deleting post action
export const deletePost = async ({ id }: { id: number }) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete post. Status: ${response.status}`);
  }
};

// updating/editing post action
export const UpdatePost = async ({
  title,
  id,
}: {
  title: string;
  id: number;
}) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update post. Status: ${response.status}`);
  }
};
