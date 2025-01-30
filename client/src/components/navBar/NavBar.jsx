import "./navBar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcons from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const NavBar = () => {
    const navigate = useNavigate();
    const {darkMode, toggle} = useContext(DarkModeContext);
    const {currentUser} = useContext(AuthContext);
    
    return (
        <div className="navbar">
            <div className="left">
                <Link to="/" style={{textDecoration: "none"}}>
                    <span>VSB Social</span>
                </Link>
                <HomeOutlinedIcon onClick={() => navigate("/")} />
                <PersonOutlinedIcon onClick={() => navigate("/profile/" + currentUser.id)} />
                {darkMode ? 
                    <WbSunnyOutlinedIcon onClick={toggle}/> :
                    <DarkModeOutlinedIcons onClick={toggle}/> 
                }
                <div className="search">
                    <SearchOutlinedIcon />
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <div className="right">
                <div className="user">
                    <img src={`/upload/${currentUser.profilePic}`} alt="" />
                    <span>{currentUser.username}</span>
                </div>
            </div>
        </div>
    )
} 

export default NavBar;