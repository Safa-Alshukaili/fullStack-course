import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";
import logo from "../Images/logo.png";
import { Form, FormGroup, Input, Label, Button, Container, Row, Col } from "reactstrap";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.users.user);
  const isSuccess = useSelector((state) => state.users.isSuccess);
  const isError = useSelector((state) => state.users.isError);

  const handleLogin = async () => {
    const userData = { email, password };
    await dispatch(login(userData));
  };

  useEffect(() => {
    if (isSuccess && user?.email) {
      navigate("/home");
    } else if (isError) {
      // يبقى على صفحة login
    }
  }, [user, isSuccess, isError, navigate]);

  return (
    <div>
      <Container>
        <Form>
          <Row>
            <Col md={3}><img src={logo} alt="logo" /></Col>
          </Row>

          <Row>
            <Col md={3}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input id="email" name="email" placeholder="enter email..." type="email"
                  onChange={(e) => setemail(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input id="password" name="password" placeholder="enter password..." type="password"
                  onChange={(e) => setpassword(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <Button color="primary" className='button' onClick={handleLogin}>Sign in</Button>
            </Col>
          </Row>
        </Form>

        <p className="smalltext">
          No account? <Link to="/register">Sign up now</Link>
        </p>
      </Container>
    </div>
  );
};

export default Login;
