import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://api.goldsky.com/api/public/project_clu14xfha8sob01ty3yvw6iuy/subgraphs/subgraph/1.0.0/gn', // Replace with your GraphQL API endpoint URL
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;