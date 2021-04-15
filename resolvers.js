import pubsub from "./pubsub";

export default {
  Author: {
    posts: (parent, args, context, info) => parent.getPosts(),
  },
  Post: {
    author: (parent, args, context, info) => parent.getAuthor(),
  },
  Query: {
    posts: (parent, args, { db }, info) => db.post.findAll(),
    authors: (parent, args, { db }, info) => db.author.findAll(),
    post: (parent, { id }, { db }, info) => db.post.findByPk(id),
    author: (parent, { id }, { db }, info) => db.author.findByPk(id) 
  },
  Mutation: {
    createPost: (parent, { title, content, authorId }, { db }, info) =>
      db.post.create({
        title: title,
        content: content,
        authorId: authorId
      }),
    updatePost: async (parent, { id, title, content }, { db }, info) => {
			// Update Data
			const post = await db.post.update({
				title: title,
        content: content
      },
      {
				where: {
					id: id
        }
      });
			// Publish 	Subscription
			pubsub.publish('postChanged', { postChanged: db.post.findAll() });
			// Callback data update
			return post;
		},
    deletePost: (parent, {id}, { db }, info) =>
      db.post.destroy({
        where: {
          id: id
        }
      })
  },
	Subscription: {
    postChanged: {
      subscribe: () => pubsub.asyncIterator(["postChanged"]),
    },
  }
};