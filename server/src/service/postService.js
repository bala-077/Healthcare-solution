const Post = require('../model/Post');

class PostService {
  async getHomeFeed() {
    return await Post.find()
      .populate('author', 'name occupation profileImage')
      .sort({ createdAt: -1 })
      .limit(5);
  }

  async createPost(authorId, content, images) {
    return await Post.create({
      content,
      images: images || [],
      author: authorId,
    });
  }

  async likePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const likeIndex = post.likes.findIndex(id => id.toString() === userId.toString());
    if (likeIndex === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    return post;
  }

  async sharePost(postId) {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { shares: 1 } },
      { new: true }
    );
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }
}

module.exports = new PostService();
