import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import UserModel from "./Models/UserModel.js";
import PostModel from "./Models/Posts.js";

const app = express();
app.use(express.json());
app.use(cors());

// ========= اتصال قاعدة البيانات =========
const connectString = `mongodb+srv://admin:admin123@postitcluster.olvjwxq.mongodb.net/postITDb?appName=PostITCluster`;

mongoose.connect(connectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ========= إعداد __dirname و static للصور =========
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


// أي طلب يبدأ بـ /uploads يرجع صورة من مجلد server/uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========= إعداد multer لرفع الصور =========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // مسار كامل
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// ========= Routes للمستخدم =========

// تحديث بسيط (لو محتاجينه)
app.put("/users/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { name, password } = req.body;
    const update = {};
    if (name) update.name = name;
    if (password) update.password = await bcrypt.hash(password, 10);

    const user = await UserModel.findOneAndUpdate({ email }, update, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user, message: "Updated" });
  } catch (e) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// POST /registerUser
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already exists" });

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ name, email, password: hashedpassword });
    await user.save();

    res.status(201).send({ user, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// POST /login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ error: "Invalid email or password" });

    res.status(200).json({ user, message: "Success." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /updateUserProfile/:email  (تحديث الاسم/الباسورد/الصورة)
app.put(
  "/updateUserProfile/:email",
  upload.single("profilePic"),
  async (req, res) => {
    const email = req.params.email;
    const name = req.body.name;
    const password = req.body.password;

    try {
      const userToUpdate = await UserModel.findOne({ email: email });

      if (!userToUpdate) {
        return res.status(404).json({ error: "User not found" });
      }

      // التعامل مع صورة جديدة
      let profilePic = null;
      if (req.file) {
        profilePic = req.file.filename;

        // حذف الصورة القديمة إن وجدت
        if (userToUpdate.profilePic && userToUpdate.profilePic !== "user.png") {
          const oldFilePath = path.join(
            __dirname,
            "uploads",
            userToUpdate.profilePic
          );
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("Old file deleted successfully");
            }
          });
        }

        userToUpdate.profilePic = profilePic;
      }

      // تحديث الاسم
      if (name) userToUpdate.name = name;

      // تحديث الباسورد لو تغيّر
      if (password && password !== userToUpdate.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userToUpdate.password = hashedPassword;
      }

      await userToUpdate.save();

      res.send({ user: userToUpdate, msg: "Updated." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ========= Routes للـPosts =========

// POST /savePost  — حفظ منشور
app.post("/savePost", async (req, res) => {
  try {
    const { postMsg, email } = req.body;

    const post = new PostModel({ postMsg, email });
    await post.save();

    res.send({ post, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// GET /getPosts — جلب كل المنشورات
app.get("/getPosts", async (_req, res) => {
  try {
    const posts = await PostModel.find({}).sort({ createdAt: -1 });
    const countPost = await PostModel.countDocuments({});
    res.send({ posts, count: countPost });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// PUT /likePost/:postId  — toggle like/unlike
app.put("/likePost/:postId", async (req, res) => {
  const postId = req.params.postId;
  const userId = (req.body.userId || "").toLowerCase().trim();

  try {
    const postToUpdate = await PostModel.findOne({ _id: postId });
    if (!postToUpdate) return res.status(404).json({ msg: "Post not found." });

    const userIndex = postToUpdate.likes.users.indexOf(userId);

    if (userIndex !== -1) {
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        { $inc: { "likes.count": -1 }, $pull: { "likes.users": userId } },
        { new: true }
      );
      res.json({ post: updatedPost, msg: "Post unliked." });
    } else {
      const updatedPost = await PostModel.findOneAndUpdate(
        { _id: postId },
        { $inc: { "likes.count": 1 }, $addToSet: { "likes.users": userId } },
        { new: true }
      );
      res.json({ post: updatedPost, msg: "Post liked." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// ========= logout =========
app.post("/logout", async (_req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

// ========= تشغيل السيرفر =========
app.listen(3001, () => {
  console.log("You are connected");
});
