import { useSearchParams } from "react-router-dom";
import PostTable from "./PostTable";
import toast from "react-hot-toast";
import { usePost } from "../hooks/usePosts";
import PaginationButtons from "./PaginationButtons";
import Header from "./Header";
import { OrderType, PAGE_SIZE_OPTIONS } from "../types";
const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const orderParams = searchParams.get("order") || "none";

  const { postQuery, addPostMutation, deletePostMutation, updatePostMutation } =
    usePost();

  const {
    data,
    isLoading: postsLoading,
    isError,
    error,
  } = postQuery(page, pageSize, search, orderParams as OrderType);

  const { mutateAsync: addPost, isPending: addLoading } = addPostMutation();
  const { mutateAsync: deletePost, isPending: deleteLoading } =
    deletePostMutation();
  const { mutateAsync: updatePost, isPending: updateLoading } =
    updatePostMutation();

  const isLoading =
    postsLoading || addLoading || deleteLoading || updateLoading;

  const handleAddPost = async (title: string) => {
    await addPost({ title });
  };

  const handleSearchPost = (searchTerm: string) => {
    setSearchParams({
      page: "1",
      pageSize: pageSize.toString(),
      ...(searchTerm !== "" && { search: searchTerm }),
      ...(orderParams !== "none" && { order: orderParams }),
    });
  };

  const handleDeletePost = async (id: number) => {
    await deletePost({ id });
  };

  const handleUpdatePost = async (title: string, id: number) => {
    await updatePost({ title, id });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (data && newPage > data.totalPages)) {
      toast.error("Invalid page number");
      return;
    }
    setSearchParams({
      page: newPage.toString(),
      pageSize: pageSize.toString(),
      ...(search !== "" && { search: search }),
      ...(orderParams !== "none" && { order: orderParams }),
    });
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value);
    if (!PAGE_SIZE_OPTIONS.includes(newPageSize)) {
      toast.error("Invalid page size");
      return;
    }
    setSearchParams({
      page: "1",
      pageSize: newPageSize.toString(),
      ...(search !== "" && { search: search }),
      ...(orderParams !== "none" && { order: orderParams }),
    });
  };

  const handleOrderChange = (orderValue: OrderType) => {
    setSearchParams({
      page: "1",
      pageSize: pageSize.toString(),
      ...(search !== "" && { search: search }),
      ...(orderValue !== "none" && { order: orderValue }),
    });
  };

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 dark:bg-red-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
            Error Loading Posts
          </h2>
          <p className="text-red-600 dark:text-red-400">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-10 backdrop-blur-sm z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
        </div>
      )}
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
          <Header
            onAddPost={handleAddPost}
            onSearch={handleSearchPost}
            onOrderChange={handleOrderChange}
          />

          <h2 className="text-2xl font-bold mb-4 text-white">Posts</h2>

          <PostTable
            posts={data?.posts || []}
            onDelete={handleDeletePost}
            onUpdate={handleUpdatePost}
          />

          {data?.posts.length > 0 && (
            <PaginationButtons
              currentPage={data?.currentPage || 1}
              totalPages={data?.totalPages || 0}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
