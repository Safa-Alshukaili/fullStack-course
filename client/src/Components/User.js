// src/Components/User.js
import defaultUser from "../Images/user.png";
import { useSelector } from "react-redux";
import Location from "./Location";

const User = () => {
  const user = useSelector((state) => state.users.user);

  const hasProfilePic = user.profilePic && user.profilePic !== "user.png";
  const picURL = hasProfilePic
    ? "http://localhost:3001/uploads/" + user.profilePic
    : defaultUser;

  return (
    <div>
      <img src={picURL} className="userImage" alt="User profile" />
      <p>
        <b>{user.name}</b>
        <br />
        {user.email}
        {/* 👇 هنا نعرض خدمة الموقع */}
        <Location />
      </p>
    </div>
  );
};

export default User;
