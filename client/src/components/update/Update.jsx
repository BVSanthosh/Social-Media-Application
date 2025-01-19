import { useState } from "react";
import "./update.scss";
import { makeRequest } from "../../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Update = ({ setOpenUpdate, user }) => {
    const [cover, setCover] = useState();
    const [profile, setProfile] = useState();
    const [texts, setTexts] = useState({
        name: "",
        location: "",
        website: "",
    });
    const [err, setErr] = useState(null);

    const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery({
        queryKey: ["user"],  
        queryFn: async () => {
          const res = await makeRequest.get("/api/users/find/" + user.id);
          return res.data;
        }
    })

    const mutation = useMutation({
        mutationFn: async (user) => {
          return await makeRequest.put("/api/users", user);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["user"] });
        }
      })

    const upload = async (file) => {
        try {
          const formData = new FormData();
    
          formData.append("file", file);
    
          const res = await makeRequest.post("/api/upload", formData);
          return res.data;
        } catch (err) {
          setErr(err);
        }
      }

    const handleChange = (e) => {
        setTexts((prev) => ({
            ...prev,
            [e.target.name]: e.target.value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let coverUrl = cover ? await upload(cover) : user.coverPic;
        let profileUrl = profile ? await upload(profile) : user.profilePic;

        mutation.mutate({
            ...texts,
            coverPic: coverUrl,
            profilePic: profileUrl
        });

        setOpenUpdate(false);
    }

    return (
      <div className="update">
        <div className="wrapper">
          <h1>Update Your Profile</h1>
          <form>
            <div className="files">
              <label htmlFor="cover">
                <span>Cover Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      cover
                        ? URL.createObjectURL(cover)
                        : "/upload/" + user.coverPic
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                id="cover"
                style={{ display: "none" }}
                onChange={(e) => setCover(e.target.files[0])}
              />
              <label htmlFor="profile">
                <span>Profile Picture</span>
                <div className="imgContainer">
                  <img
                    src={
                      profile
                        ? URL.createObjectURL(profile)
                        : "/upload/" + user.profilePic
                    }
                    alt=""
                  />
                  <CloudUploadIcon className="icon" />
                </div>
              </label>
              <input
                type="file"
                id="profile"
                style={{ display: "none" }}
                onChange={(e) => setProfile(e.target.files[0])}
              />
            </div>
            <label>Email</label>
            <input
              type="text"
              value={texts.email}
              name="email"
              onChange={handleChange}
            />
            <label>Password</label>
            <input
              type="text"
              value={texts.password}
              name="password"
              onChange={handleChange}
            />
            <label>Name</label>
            <input
              type="text"
              value={texts.name}
              name="name"
              onChange={handleChange}s
            />
            <label>Location</label>
            <input
              type="text"
              name="city"
              value={texts.city}
              onChange={handleChange}
            />
            <label>Website</label>
            <input
              type="text"
              name="website"
              value={texts.website}
              onChange={handleChange}
            />
            <button onClick={handleSubmit}>Update</button>
          </form>
          <button className="close" onClick={() => setOpenUpdate(false)}>
            close
          </button>
        </div>
      </div>
    );
}

export default Update;