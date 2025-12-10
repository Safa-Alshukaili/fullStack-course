import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../Images/logo-t.png";
import { logout } from "../Features/UserSlice.js";
import { login } from "../Features/UserSlice.js";
import { registerUser } from "../Features/UserSlice.js";
import { getPosts } from "../Features/PostSlice.js";
import { savePost } from "../Features/PostSlice.js";



const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlelogout = async () => {
    await dispatch(logout());
    await new Promise((r) => setTimeout(r, 100));
    navigate("/login");
  };

  return (
    <>
      <Navbar className="header">
        <Nav>
          <NavItem>
            <NavLink href="#">
              <img src={logo} className="loginImage" />
            </NavLink>
          </NavItem>

          <NavItem><Link to="/home">Home</Link></NavItem>
          <NavItem><Link to="/profile">Profile</Link></NavItem>
          <NavItem><Link to="/register">Register</Link></NavItem>
          <NavItem><Link onClick={handlelogout}>Logout</Link></NavItem>
        </Nav>
      </Navbar>
    </>
  );
};

export default Header;
