import gql from 'graphql-tag';

export const GET_USER_TRADERS = gql`
  query traders($address: String!) {
    traders(where: { address: $address }) {
      spearAmount
      shieldAmount
      battle {
        address
        underlying {
          symbol
        }
        collateral {
          id
        }
        endTS
        result
        sqrtPriceX96
        strikeValue
        spearAddress
        shieldAddress
        trades {
          amountIn
          amountOut
          tradeType
        }
      }
    }
  }
`;
