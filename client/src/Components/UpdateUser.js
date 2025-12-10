// src/Components/UpdateUser.js
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Container, Button, Row, Col } from "reactstrap";
import { userSchemaValidation } from "../Validations/UserValidations";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function UpdateUser() {
  const { user_email, user_name, user_password } = useParams();

  const [name, setname] = useState(user_name);
  const [email] = useState(user_email); // readOnly
  const [password, setpassword] = useState(user_password);
  const [confirmPassword, setconfirmPassword] = useState(user_password);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userSchemaValidation),
  });

  const handleUpdate = () => {
    // لا يوجد API للتحديث حتى الآن — نكتفي بالتحقق وعرض رسالة
    alert("Update is not implemented yet (no API).");
  };

  return (
    <Container>
      <Row className="formrow">
        <Col className="columndiv1" lg="6">
          <form className="div-form" onSubmit={handleSubmit(handleUpdate)}>
            <section className="form">
              <div className="Form-Group">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your name..."
                  value={name}
                  {...register("name", { onChange: (e) => setname(e.target.value) })}
                />
                <p className="error">{errors.name?.message}</p>
              </div>

              <div className="Form-Group">
                <input
                  readOnly
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  {...register("email")}
                />
                <p className="error">{errors.email?.message}</p>
              </div>

              <div className="Form-Group">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password..."
                  value={password}
                  {...register("password", { onChange: (e) => setpassword(e.target.value) })}
                />
                <p className="error">{errors.password?.message}</p>
              </div>

              <div className="Form-Group">
                <input
                  type="password"
                  className="form-control"
                  id="confirm"
                  placeholder="Confirm your password..."
                  value={confirmPassword}
                  {...register("confirmPassword", { onChange: (e) => setconfirmPassword(e.target.value) })}
                />
                <p className="error">{errors.confirmPassword?.message}</p>
              </div>

              <Button color="primary" className="button" type="submit">
                Update User
              </Button>
            </section>
          </form>
        </Col>
        <Col className="columndiv1" lg="6"></Col>
      </Row>
    </Container>
  );
}

export default UpdateUser;
