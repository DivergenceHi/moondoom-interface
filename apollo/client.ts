import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = () => {
  return new ApolloClient({
    uri: 'https://gateway.thegraph.com/api/a69b42cea134539bdf6d4196540fa007/subgraphs/id/2xF7vaoUVamRb34gaPZns8urdkBEhTCVWfNpSZaVmRrk',
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  });
};
