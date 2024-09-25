import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";

export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400);
  }

  let ischat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  ischat = await User.populate(ischat, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  if (ischat.length > 0) {
    res.send(ischat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }
  try {
    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).send(FullChat);
  } catch (error) {
    res.status(500).json({
      message: "Internal error",
    });
  }
};

export const fetchChat = async (req, res) => {
  try {
    const chat = Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name profilePic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(500).json({
      message: "Internal error",
    });
  }
};

export const createGroup = async (req, res) => {
  const { chatName, users } = req.body;

  if (!chatName || !users) {
    res.status(400).json({ message: "Please fill the fields" });
  }

  var userss = JSON.parse(users);
  if (userss.length < 2) {
    return res
      .status(400)
      .send("Group chat should have atleast 2 members except yourself!!");
  }

  userss.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: chatName,
      users: userss,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    return res.status(500).json({
      message: "Intenal Server Error",
    });
  }
};

export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedName = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).json({
      message: "Chat not updated",
    });
  } else {
    res.json(updatedChat);
  }
};

export const addUser = async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res.status(402).json({
      mesaage: "All fields required",
    });
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        users: userId,
      },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404).json({
      message: "User not added",
    });
  } else {
    res.json(added);
  }
};

export const kickUser = async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res.status(402).json({
      mesaage: "All fields required",
    });
  }

  const kicked = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        users: userId,
      },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!kicked) {
    res.status(404).json({
      message: "User still in group",
    });
  } else {
    res.json(kicked);
  }
};
