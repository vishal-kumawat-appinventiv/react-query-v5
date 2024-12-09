# React Query (Pagination)

Tanstack Docs --> https://tanstack.com/query/latest/docs/framework/react/overview

Dummyjson Docs --> https://dummyjson.com/docs/posts

This project demonstrates how to implement pagination and data management using React Query in a React TypeScript application. It includes functionalities to fetch, display, and add posts

## Advantages of React Query

- Caching... (possibly the hardest thing to do in programming)
- Deduping multiple requests for the same data into a single request
- Updating "out of date" data in the background
- Knowing when data is "out of date"
- Reflecting updates to data as quickly as possible
- Performance optimizations like pagination and lazy loading data
- Managing memory and garbage collection of server state
- Memoizing query results with structural sharing

## NPM Used in this Demo

`@tanstack/react-query`

`@tanstack/react-query-devtools`

`react-router-dom`

`react-hot-toast`

## Setting Up React QueryClient

Warp the whole application or a certion component in which we want to use react-query with QueryClientProvider passing queryClient

```
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>
);
```

## Get Pagination Data (useQuery)

useQuery is a way in which we fetch the data by giving queryFun()
and queryKey.
Addition dependency in fetch func will be added in key,
staleTime : Infinity means that tell not to req data again on component re-mounting or to tell that data is not old
enabled : true or false also be given to get the query on specific route or need

```
const { data, isLoading } = useQuery({
    queryFn: () => fetchPosts({ page }),
    queryKey: ["posts", page],
    staleTime: Infinity,
    retry : 1
  });
```

## Mutation (mutate / mutateAsync)

Mutation function will take mutaionFn , onSuccess , onError
all the POST , PUT , DELETE req will be mutaion as they will update the data
if no error then we can revalidate the cache data on demand using queryClient.invalidateQueries which will take queryKey in which we want to revalidate.
Note --> no dependency is required here

```
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
```

The way we triger mutateAsync is

```
  const { mutateAsync: addPost, isPending: addLoading } = addPostMutation();
  const handleAddPost = async () => {
    await addPost({ title });
    setTitle("");
  };
```

The way we handle pagination ui

```
const [searchParams, setSearchParams] = useSearchParams();
const page = parseInt(searchParams.get("page") || "1");
const handlePageChange = (newPage: number) => {
  setSearchParams({
    page: newPage.toString(),
    pageSize: pageSize.toString(),
  });
};
```

## Api func for pagination

We get the page number and pageSize from the params then fetch the api do error handaling do calulations for pagination and return the data.

```
export const fetchPosts = async ({
  page = 1,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const startIndex = (page - 1) * pageSize;
  const response = await fetch(
    `https://dummyjson.com/posts/?limit=${pageSize}&skip=${startIndex}`
  );

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
```

## Key Features:

- Efficient Data Fetching: Uses React Query for fetching and caching paginated data.
- Seamless Pagination: Easily navigate through pages with cached data.
- Mutations with Cache Invalidation: Ensures data consistency when adding new posts.
- Error Handaling all types are errors are been handled
- Good looking ui with Tailwind css.

### Thanks for reading :)
