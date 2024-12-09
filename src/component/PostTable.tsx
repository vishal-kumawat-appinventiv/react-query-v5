import React, { useState } from "react";
import { COLUMNS, Post } from "../types";

// table props with callbacks
interface PostTableProps {
  posts: Post[];
  onDelete: (id: number) => void;
  onUpdate: (title: string, id: number) => void;
}

const PostTable: React.FC<PostTableProps> = ({ posts, onDelete, onUpdate }) => {
  //edit title state
  const [editTitle, setEditTitle] = useState<string>("");
  //edit input toggle state
  const [titleEditOpen, setTitleEditOpen] = useState<number | null>(null);

  if (posts.length === 0) {
    return <p className="text-lg text-red-500">No posts found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700">
          {/* table header */}
          <tr>
            {COLUMNS.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {/* table body */}
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => (
            <tr
              key={post.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                {post.id}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                {titleEditOpen === post.id ? (
                  <input
                    type="text"
                    defaultValue={post.title}
                    className="w-full p-1 border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  post.title
                )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {post.views}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {post.userId}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {post.reactions.likes}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onDelete(post.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                >
                  Delete
                </button>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm">
                {titleEditOpen === post.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        onUpdate(editTitle, post.id);
                        setTitleEditOpen(null);
                      }}
                      className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setTitleEditOpen(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                    >
                      Discard
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setTitleEditOpen(post.id)}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostTable;
