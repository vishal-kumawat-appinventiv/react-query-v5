export interface Post {
  id: number;
  title: string;
  views: number;
  userId: number;
  reactions: {
    likes: number;
  };
}

export type OrderType = "asc" | "desc" | "none";

export const PAGE_SIZE_OPTIONS: number[] = [10, 25, 50, 100];

export const COLUMNS: Array<string> = [
  "ID",
  "Title",
  "Views",
  "User ID",
  "Likes",
  "Delete",
  "Edit",
];
