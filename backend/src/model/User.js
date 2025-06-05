import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  fullname:{
    type:String,
    required:true
  },
  email:{
    type :String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    unique:true,
    minlength:8
  },
  bio:{
    type:String,
    default:""
  },
  profilePicture:{
    type:String,
    default:""
  },
  nativeLanguage:{
    type:String,
    default:""
  },
  learningLanguage:{
    type:String,
    default:""
  },
  location:{
    type:String,
    default:""
  },
  inOnBoarding:{
    type:Boolean,
    default:false
  }, 
  friends:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
},{timestamps: true});
// createdAt,updatedAt
// members since createdAt
// pre hook for password hashing
userSchema.pre("save",async function (next){
  if(!this.isModified("password")) return next();
  try{
    const salt = await bcrypt.genSalt(8);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }catch(err){
    return next(err);
  }
});
userSchema.methods.matchPassword = async function (password){
  const isPasswordCorrect = await bcrypt.compare(password, this.password);
  console.log("isPasswordCorrect", isPasswordCorrect);
  if(!isPasswordCorrect)
  {
     return false;
  }
  return isPasswordCorrect;
};
const User = mongoose.model("User", userSchema);


export default User;
