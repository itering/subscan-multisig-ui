export default [{
  name: 'networkList',
  value: {
    all: {
      value: [
        {
          label: "Polkadot",
          network: "polkadot",
          value: "polkadot",
          type: "mainnet",
        },
        {
          label: "Kusama",
          network: "kusama",
          value: "kusama",
          type: "mainnet",
        },
        {
          label: "Darwinia CC1",
          network: "darwinia-cc1",
          value: "darwinia",
          type: "mainnet",
        },
        {
          label: "Darwinia Crab",
          network: "crab",
          value: "crab",
          type: "mainnet",
        }
      ]
    },
    home: {
      value: ['www.subscan.io.l2me.com', 'www.subscan.io', 'www.subscan.cn']
    },
    donate_public_key: {
      value: "0x976ce4203c844a11164d1b3f8342ad16a4cc5d99ac8eaae5cd74f4b1cc68c764"
    },
    hasSpecialModuleCall: {
      value: ['crab', 'darwinia']
    },
    ss58Format: {
      value: {
        polkadot: {
          prefix: 0,
          network: 'polkadot',
          hasLink: true
        },
        kusama: {
          prefix: 2,
          network: 'kusama',
          hasLink: true
        },
        darwinia: {
          prefix: 18,
          network: 'darwinia-cc1',
          hasLink: true
        },
        crab: {
          prefix: 42,
          network: 'crab',
          hasLink: true
        },
        westend: {
          prefix: 42,
          network: 'westend',
          hasLink: true
        },
        edgeware: {
          prefix: 7,
          network: 'edgeware',
          hasLink: true
        },
        centrifuge: {
          prefix: 36,
          network: 'centrifuge',
          hasLink: true
        },
        mandala: {
          prefix: 42,
          network: 'acala-testnet',
          hasLink: true
        },
        phala: {
          prefix: 42,
          network: 'phala',
          hasLink: true
        },
        bifrost: {
          prefix: 6,
          network: 'bifrost',
          hasLink: true
        },
        plasm: {
          prefix: 5,
          network: 'plasm',
          hasLink: true
        },
        stafi: {
          prefix: 20,
          network: 'stafi',
          hasLink: true
        },
        kulupu: {
          prefix: 16,
          network: 'kulupu',
          hasLink: true
        },
        crust: {
          prefix: 42,
          network: 'crust',
          hasLink: true
        },
        laminar: {
          prefix: 42,
          network: 'laminar-testnet',
          hasLink: true
        },
        karura: {
          prefix: 8
        },
        reynolds: {
          prefix: 9
        },
        acala: {
          prefix: 10,
        },
        polymath: {
          prefix: 12
        },
        robonomics: {
          prefix: 32
        },
        substrate: {
          prefix: 42
        },
        chainx: {
          prefix: 44
        }
      }
    }
  }
}, {
  name: 'typeList',
  value: {
    address: {
      value: [
        'address', 'lookupsource', 'reporter', 'validatorid', 'accountid', 'accountidof', '<lookup as staticlookup>::source',
        'vec<address>', 'vec<lookupsource>', 'vec<reporter>', 'vec<validatorid>', 'vec<accountid>', 'vec<accountidof>', 'vec<<lookup as staticlookup>::source>',
        'compact<address>', 'compact<lookupsource>', 'compact<reporter>', 'compact<validatorid>', 'compact<accountid>', 'compact<accountidof>', 'compact<<lookup as staticlookup>::source>',
        'option<address>', 'option<lookupsource>', 'option<reporter>', 'option<validatorid>', 'option<accountid>', 'option<accountidof>', 'option<<lookup as staticlookup>::source>'
      ]
    },
    balance: {
      value: [
        'ringbalance', 'ktonbalance',
        'balance', 'balanceof',
        'vec<balance>', 'vec<balanceof>',
        'compact<balance>', 'compact<balanceof>',
        'option<balance>', 'option<balanceof>',
      ]
    },
    good_judgements: {
      value: ['reasonable', 'known good', 'knowngood']
    },
    kton_balance: {
      value: ['ktonbalance'],
    },
    bond_extrinsic: {
      value: ['bond', 'unbond', 'bond_extra']
    },
    kton_bond_event: {
      value: ['bondkton', 'unbondkton']
    },
    bond_event: {
      value: ['bonded', 'unbonded', 'bondring', 'bondkton', 'unbondring', 'unbondkton']
    }
  }
}]
