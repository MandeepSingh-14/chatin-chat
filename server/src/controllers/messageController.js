import { Message } from "../models/messageModel";
import { User } from "../models/userModel";

export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || content) {
    return res.status(400).json({ message: "CHATID OR CONTENT IS MISSING" });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name , pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    let messages = await Message.find({ chatId })
      .populate({
        path: "Sender",
        model: "User",
        select: "name pic email",
      })
      .populate({
        path: "chatId",
        model: "Chat",
      });

    return res.status(201).json({
      message: "messages fetched",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal error",
    });
  }
};
