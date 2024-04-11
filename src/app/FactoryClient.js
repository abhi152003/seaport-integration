import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://api.goldsky.com/api/public/project_clumb10a5t92h01vb40hv66zl/subgraphs/NftFactory/1.0/gn', // Replace with your GraphQL API endpoint URL
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;