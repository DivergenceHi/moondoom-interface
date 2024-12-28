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
  {
    type: 'function',
    name: 'battleKey',
    inputs: [],
    outputs: [
      {
        name: 'key',
        type: 'tuple',
        internalType: 'struct BattleKey',
        components: [
          { name: 'collateral', type: 'address', internalType: 'address' },
          { name: 'underlying', type: 'string', internalType: 'string' },
          { name: 'expiries', type: 'uint256', internalType: 'uint256' },
          { name: 'strikeValue', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'battleOutcome',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'enum Outcome' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'fee',
    inputs: [],
    outputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getInsideLast',
    inputs: [
      { name: 'tickLower', type: 'int24', internalType: 'int24' },
      { name: 'tickUpper', type: 'int24', internalType: 'int24' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct GrowthX128',
        components: [
          { name: 'fee', type: 'uint256', internalType: 'uint256' },
          { name: 'collateralIn', type: 'uint256', internalType: 'uint256' },
          { name: 'spearOut', type: 'uint256', internalType: 'uint256' },
          { name: 'shieldOut', type: 'uint256', internalType: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'manager',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'positions',
    inputs: [{ name: 'pk', type: 'bytes32', internalType: 'bytes32' }],
    outputs: [
      {
        name: 'info',
        type: 'tuple',
        internalType: 'struct PositionInfo',
        components: [
          { name: 'liquidity', type: 'uint128', internalType: 'uint128' },
          {
            name: 'insideLast',
            type: 'tuple',
            internalType: 'struct GrowthX128',
            components: [
              { name: 'fee', type: 'uint256', internalType: 'uint256' },
              { name: 'collateralIn', type: 'uint256', internalType: 'uint256' },
              { name: 'spearOut', type: 'uint256', internalType: 'uint256' },
              { name: 'shieldOut', type: 'uint256', internalType: 'uint256' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'shield',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'shieldBalanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'slot0',
    inputs: [],
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160', internalType: 'uint160' },
      { name: 'tick', type: 'int24', internalType: 'int24' },
      { name: 'unlocked', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'spear',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'spearAndShield',
    inputs: [],
    outputs: [
      { name: '', type: 'address', internalType: 'address' },
      { name: '', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'spearBalanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'startAndEndTS',
    inputs: [],
    outputs: [
      { name: '', type: 'uint256', internalType: 'uint256' },
      { name: '', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'view',
  },
] as const;
