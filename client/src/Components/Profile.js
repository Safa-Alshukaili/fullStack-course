
//src/Components/Profile.js
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import User from "./User";
import { updateUserProfile } from "../Features/UserSlice";

const Profile = () => {
  // بيانات المستخدم من Redux
  const user = useSelector((state) => state.users.user);

  const [userName, setUserName] = useState(user.name || "");
  const [pwd, setPwd] = useState("");                   // خليه فاضي، لو حابّه تغيّرينه
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleUpdate = (event) => {
    event.preventDefault();

    if (pwd !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = {
      email: user.email,
      name: userName,
      password: pwd || user.password, // لو ما دخّلتِ باسورد جديد استخدمي القديم
      profilePic: profilePic,
    };

    dispatch(updateUserProfile(userData));
    alert("Profile Updated.");
    navigate("/profile");
  };

  return (
    <Container fluid>
      <h1>Profile</h1>
      <Row>
        <Col md={2}>
          <User />
        </Col>

        <Col md={4}>
          <h3>Update Profile</h3>
          <Form onSubmit={handleUpdate}>
            <input
              type="file"
              name="profilePic"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
            <div className="appTitle"></div>

            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Name..."
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user.email}
                readOnly
              />
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Password..."
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password..."
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Button color="primary" className="button" type="submit">
                Update Profile
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
