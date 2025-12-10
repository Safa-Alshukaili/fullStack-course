import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Components/Header";
import Home from "./Components/Home";
import { Container, Row } from "reactstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./Components/Footer";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Profile from "./Components/Profile";
import UpdateUser from "./Components/UpdateUser";
import { useSelector } from "react-redux";

const App = () => {
  const email = useSelector((state) => state.users.user.email);

  return (
    <Container fluid>
      <Router>
        <Row>
          
          {email ? <Header /> : null}
        </Row>

        <Row className="main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/update/:user_email/:user_name/:user_password" element={<UpdateUser />} />
          </Routes>
        </Row>

        <Row>
          {email ? <Footer /> : null}
        </Row>
      </Router>
    </Container>
  );
};

export default App;
