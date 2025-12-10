import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getPosts, likePost } from "../Features/PostSlice.js";
import { Table } from "reactstrap";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";


const Posts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const posts = useSelector((state) => state.posts.posts);
  const userEmail = useSelector((state) => state.users.user.email); // نستخدمه كـ userId

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleLikePost = (postId) => {
    if (!userEmail) return navigate("/login"); // حماية إضافية
    dispatch(likePost({ postId, userId: userEmail }));
    // ما نحتاج navigate هنا؛ ستتحدّث القائمة تلقائيًا
  };

  return (
    <div className="postsContainer">
      <Table className="table table-striped">
        <thead></thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              <td>{post.email}</td>
              <td>
                <p>{moment(post.createdAt).fromNow()}</p>
                {post.postMsg}
                <p className="likes" style={{ marginTop: 8 }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleLikePost(post._id); }}>
                    <FaThumbsUp />
                  </a>{" "}
                  ({post.likes?.count ?? 0})
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Posts;
