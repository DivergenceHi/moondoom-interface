import gql from 'graphql-tag';

export const GET_USER_NFTS = gql`
  query nfts($address: String!) {
    nfts(where: { owner: $address }) {
      liquidity
      shieldObligation
      spearObligation
      liquidityType
      id
      collateralSeed
      battle {
        address
        underlying {
          symbol
        }
        collateral {
          decimals
          symbol
          id
        }
        endTS
        strikeValue
        sqrtPriceX96
      }
      tickLowerIdx
      tickUpperIdx
      status
      shieldOutOwed
      spearOutOwed
      amountSeed
    }
  }
`;
