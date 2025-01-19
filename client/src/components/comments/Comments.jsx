import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios.js"; 
import moment from "moment";

const Comments = ({ postId }) => {
    const [desc, setDesc] = useState("");
    const {currentUser} = useContext(AuthContext);
    const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery({
        queryKey: ["comments"],
        queryFn: async () => {
            const res = await makeRequest.get("/api/comments?postId=" + postId);
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (newComment) => {
            return await makeRequest.post("/api/comments", newComment);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        }
    })

    const handleClick = async (e) => {
        e.preventDefault();

        mutation.mutate({ desc, postId });
        setDesc("");
    }

    return (
        <div className="comments">
            <div className="write">
                <img src={currentUser.profilePic} alt="" />
                <input type="text" value={desc} placeholder="Write a comment" onChange={(e) => setDesc(e.target.value)}/>
                <button onClick={handleClick}>Send</button>
            </div>
            {error ? "Something went wrong" 
                : isLoading 
                ? "loading..." 
                : data.map(comment => (
                <div className="comment">
                    <img src={comment.profilePic} alt="" />
                    <div className="info">
                        <span>{comment.name}</span>
                        <p>{comment.desc}</p>
                    </div>
                    <span className="date">{moment(comment.createdAt).fromNow()}</span>
                </div>
            ))}
        </div>
    )
}

export default Comments;