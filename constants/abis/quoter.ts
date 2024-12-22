export const QuoterABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_arena',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_manager',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'BattleNotExist',
    type: 'error',
  },
  {
    inputs: [],
    name: 'T',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TickInvalid',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'accountPositions',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'battleAddr',
            type: 'address',
          },
          {
            internalType: 'int24',
            name: 'tickLower',
            type: 'int24',
          },
          {
            internalType: 'int24',
            name: 'tickUpper',
            type: 'int24',
          },
          {
            internalType: 'uint128',
            name: 'liquidity',
            type: 'uint128',
          },
          {
            internalType: 'enum LiquidityType',
            name: 'liquidityType',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'seed',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'fee',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'collateralIn',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'spearOut',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'shieldOut',
                type: 'uint256',
              },
            ],
            internalType: 'struct GrowthX128',
            name: 'insideLast',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint128',
                name: 'fee',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'collateralIn',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'spearOut',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'shieldOut',
                type: 'uint128',
              },
            ],
            internalType: 'struct Owed',
            name: 'owed',
            type: 'tuple',
          },
          {
            internalType: 'enum PositionState',
            name: 'state',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'spearObligation',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'shieldObligation',
            type: 'uint256',
          },
        ],
        internalType: 'struct Position[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'arena',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'address',
                name: 'collateral',
                type: 'address',
              },
              {
                internalType: 'string',
                name: 'underlying',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'expiries',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'strikeValue',
                type: 'uint256',
              },
            ],
            internalType: 'struct BattleKey',
            name: 'battleKey',
            type: 'tuple',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'int24',
            name: 'tickLower',
            type: 'int24',
          },
          {
            internalType: 'int24',
            name: 'tickUpper',
            type: 'int24',
          },
          {
            internalType: 'uint160',
            name: 'minSqrtPriceX96',
            type: 'uint160',
          },
          {
            internalType: 'uint160',
            name: 'maxSqrtPriceX96',
            type: 'uint160',
          },
          {
            internalType: 'enum LiquidityType',
            name: 'liquidityType',
            type: 'uint8',
          },
          {
            internalType: 'uint128',
            name: 'amount',
            type: 'uint128',
          },
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256',
          },
        ],
        internalType: 'struct AddLiqParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'getSTokenByLiquidity',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
      {
        internalType: 'int24',
        name: 'tickLower',
        type: 'int24',
      },
      {
        internalType: 'int24',
        name: 'tickUpper',
        type: 'int24',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'getSTokenByLiquidityWhenCreate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'manager',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'positions',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'battleAddr',
            type: 'address',
          },
          {
            internalType: 'int24',
            name: 'tickLower',
            type: 'int24',
          },
          {
            internalType: 'int24',
            name: 'tickUpper',
            type: 'int24',
          },
          {
            internalType: 'uint128',
            name: 'liquidity',
            type: 'uint128',
          },
          {
            internalType: 'enum LiquidityType',
            name: 'liquidityType',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'seed',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'uint256',
                name: 'fee',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'collateralIn',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'spearOut',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'shieldOut',
                type: 'uint256',
              },
            ],
            internalType: 'struct GrowthX128',
            name: 'insideLast',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint128',
                name: 'fee',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'collateralIn',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'spearOut',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'shieldOut',
                type: 'uint128',
              },
            ],
            internalType: 'struct Owed',
            name: 'owed',
            type: 'tuple',
          },
          {
            internalType: 'enum PositionState',
            name: 'state',
            type: 'uint8',
          },
          {
            internalType: 'uint256',
            name: 'spearObligation',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'shieldObligation',
            type: 'uint256',
          },
        ],
        internalType: 'struct Position',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'enum TradeType',
            name: 'tradeType',
            type: 'uint8',
          },
          {
            internalType: 'int256',
            name: 'amountSpecified',
            type: 'int256',
          },
          {
            internalType: 'uint160',
            name: 'sqrtPriceLimitX96',
            type: 'uint160',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct BattleTradeParams',
        name: 'params',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'battleAddr',
        type: 'address',
      },
    ],
    name: 'quoteExactInput',
    outputs: [
      {
        internalType: 'uint256',
        name: 'spend',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'get',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'cAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'sAmount',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'tradeCallback',
    outputs: [],
    stateMutability: 'pure',
    type: 'function',
  },
] as const
