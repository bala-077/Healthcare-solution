const User = require('../model/User');
const AppError = require('../utils/AppError');

class UserService {
  async getDiscoverUsers(currentUser) {
    // Return users excluding self and current connections
    const users = await User.find({
      _id: { 
        $ne: currentUser._id, 
        $nin: currentUser.connections 
      }
    });
    return users;
  }

  async getAllUsers(currentUser, searchQuery = '') {
    // Return all users excluding self, optionally filtered by name
    const query = {
      _id: { 
        $ne: currentUser._id
      }
    };
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: 'i' };
    }
    const users = await User.find(query);
    return users;
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async sendConnectionRequest(currentUser, receiverId) {
    if (currentUser._id.toString() === receiverId.toString()) {
      throw new AppError('Cannot connect with yourself', 400);
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      throw new AppError('User not found', 404);
    }

    // Check if they are already connected
    if (currentUser.connections.includes(receiverId)) {
      throw new AppError('Already connected', 400);
    }

    // If request is already pending, cancel it (toggle off)
    const requestIndex = receiver.connectionRequests.findIndex(id => id.toString() === currentUser._id.toString());
    if (requestIndex > -1) {
      receiver.connectionRequests.splice(requestIndex, 1);
      await receiver.save();
      return { status: 'cancelled' };
    }

    // Otherwise, send the request
    // Prevent duplicates just in case
    if (!receiver.connectionRequests.includes(currentUser._id)) {
      receiver.connectionRequests.push(currentUser._id);
      await receiver.save();
    }
    return { status: 'sent' };
  }

  async acceptConnectionRequest(currentUser, senderId) {
    // Check if request exists
    if (!currentUser.connectionRequests.includes(senderId)) {
      throw new AppError('No connection request found from this user', 400);
    }

    // Add to each other's connections
    currentUser.connections.push(senderId);
    // Remove from pending requests
    currentUser.connectionRequests = currentUser.connectionRequests.filter(
      (id) => id.toString() !== senderId.toString()
    );
    await currentUser.save();

    const sender = await User.findById(senderId);
    if (sender && !sender.connections.includes(currentUser._id)) {
      sender.connections.push(currentUser._id);
      await sender.save();
    }
    return true;
  }
}

module.exports = new UserService();
