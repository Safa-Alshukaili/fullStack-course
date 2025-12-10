//server/Models/Posts.js
import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    postMsg: { type: String, required: true },
    email:   { type: String, required: true },
    likes: {
      count: { type: Number, default: 0 },
      users: { type: [String], default: [] }, // array of emails
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const PostModel = mongoose.model("posts", PostSchema);
export default PostModel;
