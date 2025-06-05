import User from '../model/User.js';
import FriendRequest from '../model/FriendRequest.js';
export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { inOnBoarding: true },
      ],
    });
    console.log(recommendedUsers);
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriends(req,res){
    try{
      const user = await User.findById(req.user.id).select("friends").populate("friends","fullname profilePicture nativeLanguage learningLanguage");
      if(!user){
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user.friends);
    }
    catch(error){
      console.error("Error in getFriends controller:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
};
export async function sendFriendRequest(req,res){
      try{
        const myId = req.user.id;
        const { id:recipientId } = req.params;
        if(myId === recipientId){
          return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }
        const user = await User.findById(myId);
        if(!user){
          return res.status(404).json({ message: "User not found" });
        }
        const recipient = await User.findById(recipientId);
        if(!recipient){
           return res.status(404).json({ message: "Recipient not found" });
        }
        const isAlreadyFriend = await FriendRequest.findOne({
          $or: [
            { sender: myId, recipient: recipientId },
            { sender: recipientId, recipient: myId }          ]
        });
        if(isAlreadyFriend){
          return res.status(400).json({ message: "Friend request already sent or received" });
        }
        const friendRequest = await FriendRequest.create({
          sender: myId,
          recipient: recipientId,
        });
        console.log(friendRequest);
        res.status(201).json({ message: "Friend request sent successfully", friendRequest });
      }
      catch(error){
        res.status(500).json({message:"internal server error"});
      }
}
export async function acceptFriendRequest(req,res){
    try
    {
         const {id:requestId} = req.params;
         
         const friendRequest = await FriendRequest.findById(requestId);
         if(!friendRequest)
         {
            return res.status(404).json({message:"Friend request not found"});
         }
         //verify the current user is the recipient
         if(friendRequest.recipient.toString()!==req.user.id)
         {
             return res.status(403).json({message:"You are not authorized to accept this request"});
         }
         friendRequest.status = "accepted";
         await friendRequest.save();
         await User.findByIdAndUpdate(friendRequest.sender,{
             $addToSet:{friends:friendRequest.recipient}
         });
         await User.findByIdAndUpdate(friendRequest.recipient,{
             $addToSet:{friends:friendRequest.sender}
         });
         res.status(200).json({message:"Friend request accepted successfully"});
    }
    catch(error)
    {
        console.error("Error in acceptFriendRequest controller:", error);
        res.status(500).json({message:"Internal server error"});
    }
}
export async function getFriendRequests(req,res){
   try{
     const incomingRequests = await FriendRequest.find({
       recipient:req.user.id,
       status:"pending",
       
     }).populate("sender","fullname profilePicture nativeLanguage learningLanguage");
     const acceptedRequests = await FriendRequest.find({
       recipient:req.user.id,
       status:"accepted",
     }).populate("sender","fullname profilePicture nativeLanguage learningLanguage");
     res.status(200).json({incomingRequests,acceptedRequests});
   }
   catch(error)
   {
       console.error("Error in getFriendRequests controller:", error);
       res.status(500).json({message:"Internal server error"});
   }
}
export async function getOutgoingFriendRequests(req,res){
    try{
       const getOutgoingFriendRequests = await FriendRequest.find({
        sender:req.user.id,
        status:"pending",
       }).populate("recipient","fullname profilePicture nativeLanguage LearningLanguage");
       res.status(200).json(getOutgoingFriendRequests);
    }
    catch(error){
       console.error("Error in getOutgoingFriendRequests controller:", error);
       res.status(500).json({message:"Internal server error"});
    }
}