import { upsertStreamUser } from "../lib/stream.js";
import User from "../model/User.js";
import jwt from "jsonwebtoken";

/**
 * Handles user signup.
 * Validates input, checks for existing user, hashes password, creates user, and sets JWT cookie.
 */
export async function signup(req, res) {
  // Destructure required fields from request body
  const { fullname, email, password } = req.body;

  try {
    // Check if all fields are provided
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a different one" });
    }

    // Generate a random avatar index and URL
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // Create the new user in the database
    const newUser = await User.create({
      email,
      fullname,
      password,
      profilePicture: randomAvatar,
    });
    //saving new user data to the Stream service
    // Upsert the user in Stream
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullname,
        image: newUser.profilePicture || "",
      });
      console.log("Stream user upserted successfully:" + newUser._id);
    } catch (err) {
      console.error("Error upserting Stream user:", err);
    }
    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set the JWT as an HTTP-only cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Respond with the created user (excluding sensitive info)
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    // Log and handle errors
    console.log("Error in signup controller", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Handles user login (to be implemented).
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set the JWT as an HTTP-only cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Login successful", success: true, user });
  } catch (err) {
    console.log("Error in login controller", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Handles user logout (to be implemented).
 */
export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "Logout successful", success: true });
}
export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res
        .status(400)
        .json({
          message: "All fields are required",
          missingFields: [
            !fullName && "fullName",
            !bio && "bio",
            !nativeLanguage && "nativeLanguage",
            !learningLanguage && "learningLanguage",
            !location && "location",
          ],
        });
    }
    const updatedUser=await User.findByIdAndUpdate(userId,{
      ...req.body,
      inOnBoarding: true,
    },{new:true})
    if(!updatedUser){
      return res.status(404).json({ message: "User not found" });
    }
    try{
    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullname,
      image: updatedUser.profilePicture || "",
      language: updatedUser.nativeLanguage || ""
    });
    console.log("Stream user upserted successfully:" + updatedUser._id);
  }
  catch(streamerr){
    console.error("Error upserting Stream user:", streamerr);
  }
    res.status(200).json({message:"User onboarded successfully",user:updatedUser});

  } catch (err) {
    console.log("Error in onboarding controller", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
