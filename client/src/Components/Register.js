import { Form, Input, Button, Container, Row, Col } from "reactstrap";
import { userSchemaValidation } from "../Validations/UserValidations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { registerUser } from "../Features/UserSlice";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userSchemaValidation),
  });

  const onSubmit = async (data) => {
    try {
      const userData = { name: data.name, email: data.email, password: data.password };
      await dispatch(registerUser(userData));
      alert("Validation all good.");
      navigate("/login"); // توجيه بعد التسجيل
    } catch (error) {
      console.log("Error.");
    }
  };

  return (
    <Container fluid>
      <Row className="formrow">
        <Col className="columndiv1" lg="6">
          <Form className="div-form" onSubmit={handleSubmit(onSubmit)}>
            <section className="form">
              <div className="Form-Group">
                <input type="text" className="form-control" id="name" placeholder="Enter your name..."
                  {...register("name", { onChange: (e) => setname(e.target.value) })}/>
                <p className="error">{errors.name?.message}</p>
              </div>

              <div className="Form-Group">
                <input type="text" className="form-control" id="email" placeholder="Enter your email..."
                  {...register("email", { onChange: (e) => setemail(e.target.value) })}/>
                <p className="error">{errors.email?.message}</p>
              </div>

              <div className="Form-Group">
                <input type="password" className="form-control" id="password" placeholder="Enter your password..."
                  {...register("password", { onChange: (e) => setpassword(e.target.value) })}/>
                <p className="error">{errors.password?.message}</p>
              </div>

              <div className="Form-Group">
                <input type="password" className="form-control" id="confirm" placeholder="Confirm your password..."
                  {...register("confirmPassword", { onChange: (e) => setconfirmPassword(e.target.value) })}/>
                <p className="error">{errors.confirmPassword?.message}</p>
              </div>

              <Button color="primary" className="button">Register</Button>

              <p className="smalltext">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </section>
          </Form>
        </Col>
        <Col className="columndiv1" lg="6"></Col>
      </Row>
    </Container>
  );
};

export default Register;
