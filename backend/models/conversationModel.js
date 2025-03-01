import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    ],
    messages:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: []
        }
    ]
},{
    timestamps: true
});
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;

// Middleware to ensure messaging is only allowed between followers
// conversationSchema.pre("save", async function (next) {
//     const User = mongoose.model("User");
//     const [user1, user2] = this.participants;
  
//     const user1Data = await User.findById(user1);
//     const user2Data = await User.findById(user2);
  
//     if (!user1Data.following.includes(user2) || !user2Data.following.includes(user1)) {
//       return next(new Error("Users must follow each other to start a conversation."));
//     }
  
//     next();
//   });