import  "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
    const {currentUser} = useContext(AuthContext);
    const [commentOpen, setCommentOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const queryClient = useQueryClient();

    const { isLoading: likesLoading, error: likesError, data: likesData = []} = useQuery({
        queryKey: ["likes", post.id], 
        queryFn: async () => {
          const res = await makeRequest.get("/api/likes?postId=" + post.id);
          return res.data;
        }
    })

    const { isLoading: comLoading, error: comError, data: comData = []} = useQuery({
        queryKey: ["comments", post.id],
        queryFn: async () => {
            const res = await makeRequest.get("/api/comments?postId=" + post.id);
            return res.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (liked) => {
            if (liked) {
                return await makeRequest.delete("/api/likes?postId=" + post.id);
            } else {
                return await makeRequest.post("/api/likes", {postId: post.id});
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["likes"] });
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (postId) => {
            return await makeRequest.delete("/api/posts/" + postId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        }
    })

    const commentsMutation = useMutation({
        mutationFn: async (newComment) => {
            return await makeRequest.post("/api/comments", newComment);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        }
    })

    const handleSendComment = async (desc) => {
        commentsMutation.mutate({ desc, postId: post.id });
    }

    const handleLike = () => {
        mutation.mutate(likesData.includes(currentUser.id));
    }

    const handleDelete = () => {
        deleteMutation.mutate(post.id);
    }

    return (
        <div className="post"> 
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <img src={"/upload/"+post.profilePic} alt="" />
                        <div className="details">
                            <Link to={`/profile/${post.userId}`} style={{textDecoration: "none", color: "inherit"}}>
                                <span className="name">{post.username}</span>
                            </Link>
                            <span className="date">{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)}/>
                        {menuOpen && post.userId === currentUser.id && <button onClick={handleDelete}>delete</button>}
                </div>
                <div className="content">
                    <p>{post.desc}</p>
                    <img src={"./upload/" + post.img} alt="" />
                </div>
                <div className="info">
                    <div className="items">
                        {likesLoading 
                            ? "loading" 
                            : likesData.includes(currentUser.id) 
                            ? (
                                <FavoriteOutlinedIcon style={{color: "red"}} onClick={handleLike} /> 
                            ) : ( 
                                <FavoriteBorderOutlinedIcon onClick={handleLike}/>
                            )
                        }
                        {likesData.length} likes
                    </div>
                    <div className="items" onClick={() => setCommentOpen(!commentOpen)}>
                        <TextsmsOutlinedIcon />
                        {comData.length} comments
                    </div>
                </div>
                {commentOpen && <Comments postId={post.id} comLoading={comLoading} comError={comError} comData={comData} handleSendComment={handleSendComment} />}
            </div>
        </div>
    )
}

export default Post;