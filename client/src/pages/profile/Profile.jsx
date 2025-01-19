import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
    const [openUpdate, setOpenUpdate] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const userId = parseInt(useLocation().pathname.split("/")[2]);
    const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery({
        queryKey: ["user"],  
        queryFn: async () => {
          const res = await makeRequest.get("/api/users/find/" + userId);
          return res.data;
        }
    })

    const { isLoading: relationIsLoading, data: relationData } = useQuery({
        queryKey: ["relationship"],  
        queryFn: async () => {
          const res = await makeRequest.get("/api/relationships?followedUserId=" + userId);
          return res.data;
        }
    })

    const mutation = useMutation({
        mutationFn: async (following) => {
            if (following) {
                return await makeRequest.delete("/api/relationships?userId=" + userId);
            } else {
                return await makeRequest.post("/api/relationships", {userId});
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["relationship"] });
        }
      })

    const handleFollow = () => {
        mutation.mutate(relationData.includes(currentUser.id));
    }

    return (
        <div className="profile">
            {isLoading ? (
                "loading..." 
            ) : ( 
                <>
                    <div className="images">
                        <img
                            src={"/upload/" + data.coverPic} alt="" className="cover" />
                        <img
                            src={"/upload/" + data.profilePic} alt="" className="profilePic" />
                    </div>
                    <div className="profileContainer">
                        <div className="uInfo">
                            <div className="left">
                                <a href="http://facebook.com">
                                <FacebookTwoToneIcon fontSize="large" />
                                </a>
                                <a href="http://facebook.com">
                                <InstagramIcon fontSize="large" />
                                </a>
                                <a href="http://facebook.com">
                                <TwitterIcon fontSize="large" />
                                </a>
                                <a href="http://facebook.com">
                                <LinkedInIcon fontSize="large" />
                                </a>
                                <a href="http://facebook.com">
                                <PinterestIcon fontSize="large" />
                                </a>
                            </div>
                            <div className="center">
                                <span>{data.name}</span>
                                <div className="info">
                                    <div className="item">
                                        <PlaceIcon />
                                        <span>{data.location}</span>
                                    </div>
                                    <div className="item">
                                        <LanguageIcon />
                                        <span>{data.website}</span>
                                    </div>
                                </div>
                                {relationIsLoading ? (
                                    "loading..." 
                                    ) : userId === currentUser.id ? (
                                        <button onClick={() => setOpenUpdate(true)}>Update</button>
                                    ) : (
                                        <button onClick={handleFollow}>
                                            {relationData.includes(currentUser.id) 
                                                ? "Following" 
                                                : "Follow"
                                            }
                                        </button>
                                    )
                                }
                            </div>
                            <div className="right">
                                <EmailOutlinedIcon />
                                <MoreVertIcon />
                            </div>
                        </div>
                        <Posts userId={userId}/>
                    </div>
                </>
            )}
            {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/>}
        </div>
    )
}

export default Profile;