import dotenv from 'dotenv'
import { ApolloServer, gql } from "apollo-server";
import faker from "faker";
import times from "lodash.times";
import random from "lodash.random";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import db from "./models";

dotenv.config()

const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
  context: { db },
	subscriptions: {
    path: '/subscriptions'
  },
});

db.sequelize.sync({ force: false }).then(() => {
  // populate author table with dummy data
  /* db.author.bulkCreate(
    times(10, () => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    }))
  );
  // populate post table with dummy data
  db.post.bulkCreate(
    times(10, () => ({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      authorId: random(1, 10)
    }))
  ); */

  server.listen({ port: process.env.PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
    console.log(`🚀 Server ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`);
  });
});