export const ArenaAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_oracleAddr',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_battleImpl',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'BattleExisted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CallerNotManager',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotSupported',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotSupportedExpiries',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ZeroAddress',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
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
        indexed: false,
        internalType: 'struct BattleKey',
        name: 'bk',
        type: 'tuple',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'battleAddr',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'spear',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'shield',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'transactionFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'exerciseFee',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct Fee',
        name: 'fee',
        type: 'tuple',
      },
    ],
    name: 'BattleCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'collateral',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'state',
        type: 'bool',
      },
    ],
    name: 'CollateralWhitelistChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'underlying',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'transactionFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'exerciseFee',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct Fee',
        name: 'fee',
        type: 'tuple',
      },
    ],
    name: 'FeeChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'old',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_new',
        type: 'address',
      },
    ],
    name: 'ManagerChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: 'state',
        type: 'bool',
      },
    ],
    name: 'PermissionlessChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'collateralToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'underlying',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isSupported',
        type: 'bool',
      },
    ],
    name: 'SupportedChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'underlying',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'state',
        type: 'bool',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'transactionFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'exerciseFee',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct Fee',
        name: 'fee',
        type: 'tuple',
      },
    ],
    name: 'UnderlyingWhitelistChanged',
    type: 'event',
  },
  {
    inputs: [],
    name: 'battleImpl',
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
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'battles',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'collateralWhitelist',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
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
    name: 'createBattle',
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
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'fees',
    outputs: [
      {
        internalType: 'uint256',
        name: 'transactionFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'protocolFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'exerciseFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllBattles',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'battle',
            type: 'address',
          },
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
          {
            internalType: 'int24',
            name: 'tick',
            type: 'int24',
          },
          {
            internalType: 'uint256',
            name: 'startTS',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endTS',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'spear',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'shield',
            type: 'address',
          },
          {
            internalType: 'enum Outcome',
            name: 'result',
            type: 'uint8',
          },
        ],
        internalType: 'struct IArenaState.BattleInfo[]',
        name: '',
        type: 'tuple[]',
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
    ],
    name: 'getBattle',
    outputs: [
      {
        internalType: 'address',
        name: 'battle',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isPermissionless',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'managerAddr',
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
    name: 'oracleAddr',
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
    name: 'owner',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collateral',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isSupported',
        type: 'bool',
      },
    ],
    name: 'setCollateralWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'underlying',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'transactionFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'exerciseFee',
            type: 'uint256',
          },
        ],
        internalType: 'struct Fee',
        name: '_fee',
        type: 'tuple',
      },
    ],
    name: 'setFeeForUnderlying',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_manager',
        type: 'address',
      },
    ],
    name: 'setManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'setPermissionless',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'underlying',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isSupported',
        type: 'bool',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'transactionFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'exerciseFee',
            type: 'uint256',
          },
        ],
        internalType: 'struct Fee',
        name: 'fee',
        type: 'tuple',
      },
    ],
    name: 'setUnderlyingWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'underlyingWhitelist',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
