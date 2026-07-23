const Chat = require('../model/Chat');
const AppError = require('../utils/AppError');

class ChatService {
  async getChatHistory(currentUser, receiverId) {
    // Check if connected
    if (!currentUser.connections.includes(receiverId)) {
      throw new AppError('You must be connected to chat', 403);
    }

    // Mark unread messages as read
    await Chat.updateMany(
      { sender: receiverId, receiver: currentUser._id, isRead: false },
      { isRead: true }
    );

    const chats = await Chat.find({
      $or: [
        { sender: currentUser._id, receiver: receiverId },
        { sender: receiverId, receiver: currentUser._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sharedPost');

    return chats;
  }

  async getRecentChats(currentUser) {
    const userId = currentUser._id;
    
    // Find all chats involving the user, sort by newest first
    const chats = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name profileImage occupation')
    .populate('receiver', 'name profileImage occupation');

    // Group by unique conversation partner
    const recentChatsMap = new Map();
    const unreadCounts = new Map();

    chats.forEach(chat => {
      // Determine the other user in the conversation
      const isSender = chat.sender._id.toString() === userId.toString();
      const partnerId = isSender ? chat.receiver._id.toString() : chat.sender._id.toString();
      const partner = isSender ? chat.receiver : chat.sender;

      // Count unread if we are the receiver
      if (!isSender && !chat.isRead) {
        unreadCounts.set(partnerId, (unreadCounts.get(partnerId) || 0) + 1);
      }

      // Keep only the latest message for the map
      if (!recentChatsMap.has(partnerId)) {
        recentChatsMap.set(partnerId, {
          user: partner,
          latestMessage: chat,
          unreadCount: 0, // will set after
        });
      }
    });

    // Apply unread counts and convert to array
    const recentChats = Array.from(recentChatsMap.values()).map(chatData => ({
      ...chatData,
      unreadCount: unreadCounts.get(chatData.user._id.toString()) || 0
    }));

    return recentChats;
  }

  async sendMessage(currentUser, receiverId, message, sharedPostId) {
    const receivers = Array.isArray(receiverId) ? receiverId : [receiverId];
    
    // Check connections for all receivers
    for (const rId of receivers) {
      if (!currentUser.connections.includes(rId)) {
        throw new AppError('You must be connected to chat with all selected users', 403);
      }
    }

    const chatsToCreate = receivers.map(rId => {
      const data = {
        sender: currentUser._id,
        receiver: rId,
      };
      if (message) data.message = message;
      if (sharedPostId) data.sharedPost = sharedPostId;
      return data;
    });

    const createdChats = await Chat.insertMany(chatsToCreate);
    
    // Return populated chats
    const populatedChats = await Chat.find({
      _id: { $in: createdChats.map(c => c._id) }
    }).populate('sharedPost');

    return Array.isArray(receiverId) ? populatedChats : populatedChats[0];
  }
}

module.exports = new ChatService();
