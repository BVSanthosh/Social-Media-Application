import  "./posts.scss";
import Post from "../post/Post";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const { isLoading, error, data = [] } = useQuery({
    queryKey: ["posts"], 
    queryFn: async () => {
      const res = await makeRequest.get("/api/posts?userId=" + userId);
      return res.data;
    }
  })

  return (
    <div className="posts">
      {error
        ? "Something went wrong" 
        : isLoading 
        ? "loading..." 
        : data.map(post => (
          <Post key={post.id} post={post} />
        ))
      }
    </div>
  )
}

export default Posts;