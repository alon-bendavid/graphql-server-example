import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID
    title: String
    author: String
  }
  type Query {
    books: [Book]
    getBookById(bookId: ID): Book
  }

  type Mutation {
    addBook(title: String, author: String): Book
  }
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;


const books = [
    {
      id: "0",
      title: "The Awakening",
      author: "Kate Chopin",
    },
    {
      id: "1",
      title: "City of Glass",
      author: "Paul Auster",
    },
  ];

  // Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      books: () => books,
      getBookById: (_, args) => books.find((book) => book.id == args.bookId),
    },
    Mutation: {
      addBook: (_, args) => {
        const lastId = parseInt(books[books.length - 1].id, 10);
        const newId = (lastId + 1).toString();
        books.push({
          title: args.title,
          author: args.author,
          id: newId,
        });
        return books[books.length - 1];
      },
    },
  };



  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);