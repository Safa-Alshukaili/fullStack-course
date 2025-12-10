import { Container, Row, Form, FormGroup, Input, Button } from "reactstrap";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePost } from "../Features/PostSlice";
import { useNavigate } from "react-router-dom";

const SharePosts = () => {
  const [postMsg, setpostMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.users.user.email);

  const handlePost = async () => {
    if (!email) {
      // حماية إضافية: لو شخص وصل هنا بدون تسجيل
      return navigate("/login");
    }
    if (!postMsg.trim()) {
      alert("Post message is required.");
      return;
    }
    const postData = { postMsg, email };
    await dispatch(savePost(postData));
    setpostMsg(""); // clear textarea
  };

  return (
    <Container>
      <Row>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            <Input
              id="Share"
              name="Share"
              type="textarea"       // ✅ تصحيح النوع
              value={postMsg}       // ✅ controlled
              onChange={(e) => setpostMsg(e.target.value)}
            />
            <br />
            <Button color="primary" onClick={handlePost}>
              Post IT
            </Button>
          </FormGroup>
        </Form>
      </Row>
    </Container>
  );
};

export default SharePosts;
