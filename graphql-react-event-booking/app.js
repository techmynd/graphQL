const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    // keys
    // String! means String should not be null
    // ! means this type is non-nullable and can not be null, its mandatory
    // names such as events in buildSchema should match names in rootValue
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }
      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }
      type RootQuery {
        events: [String!]!
      }
      type RootMutations {
        createEvent(eventInput: EventInput): Event
      }
      schema {
        query: RootQuery
        mutation: RootMutations
      }
    `),
    // all resolver functions
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: args => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        events.push(event);
        return event;
      },
    },
    // this line below gives us graphical gui for graphql
    graphiql: true,
  }),
);

app.get("/", (req, res, next) => {
  res.send("...GraphQL...");
});

// mongodb+srv://graphjd:<password>@graphqltest-k1dwe.mongodb.net/test?retryWrites=true&w=majority
// user is graphjd // password is <password> // database name is test

// console.log(process.env.MONGO_USER);
// console.log(process.env.MONGO_PASSWORD);
// console.log(process.env.MONGO_DB);

// password must not contain special characters
// only abcd or 1234 // otherwise app will not connect to mongo db
// Dang!!!

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@graphqltest-k1dwe.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
    },
  )
  .then(() => {
    // sucess
    app.listen(3000, () => {
      console.log(" ... http://localhost:3000 ....");
    });
  })
  .catch(err => {
    console.log(err);
  });

// paste this in graphqli
/*
mutation {
	createEvent(eventInput: {
    title: "Just a test", 
    description: "does this work", 
    price: 50, 
    date: "2019-06-30T19:10:34.655Z"}
  ){
    title
    description
    price
  }
}

or 

query {
  events {
    _id
		date
  }
}

*/
