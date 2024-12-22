import * as console from 'node:console';

export const BattleAbi = [
  {
    inputs: [],
    name: 'BattleExisted',
    type: 'error',
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
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'WETH9',
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
            name: 'bk',
            type: 'tuple',
          },
          {
            internalType: 'uint160',
            name: 'sqrtPriceX96',
            type: 'uint160',
          },
        ],
        internalType: 'struct CreateAndInitBattleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'createAndInitializeBattle',
    outputs: [
      {
        internalType: 'address',
        name: 'battle',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
