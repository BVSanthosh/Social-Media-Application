import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import moment from "moment";

const Comments = ({ postId, commLoading, commError, comData, handleSendComment }) => {
    const [desc, setDesc] = useState("");
    const {currentUser} = useContext(AuthContext);

    const handleClick = async (e) => {
        e.preventDefault();

        handleSendComment(desc);
        setDesc("");
    }

    return (
        <div className="comments">
            <div className="write">
                <img src={`/upload/${currentUser.profilePic}`} alt="" />
                <input type="text" value={desc} placeholder="Write a comment" onChange={(e) => setDesc(e.target.value)}/>
                <button onClick={handleClick}>Send</button>
            </div>
            {commError ? "Something went wrong" 
                : commLoading 
                ? "loading..." 
                : comData.map(comment => (
                <div className="comment">
                    <img src={`/upload/${currentUser.profilePic}`} alt="" />
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