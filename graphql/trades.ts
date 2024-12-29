import gql from 'graphql-tag';

export const GET_USER_TRADES = gql`
  query trades($sender: String!, $battle: String!) {
    trades(where: { sender: $sender, battle: $battle }) {
      id
      amountIn
      amountOut
    }
  }
`;
