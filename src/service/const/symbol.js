const cring_icon = require('./../../assets/images/cring.svg')
const ring_icon = require('./../../assets/images/ring.svg')
const pring_icon = require('./../../assets/images/pring.svg')
const ckton_icon = require('./../../assets/images/ckton.svg')
const kton_icon = require('./../../assets/images/kton.svg')
const crab_button = require('./../../assets/images/crab-button.png')
const crab_m_button = require('./../../assets/images/crab-button-mobile.png')
const darwinia_button = require('./../../assets/images/darwinia-button.png')
const darwinia_m_button = require('./../../assets/images/darwinia-button-mobile.png')
const pangolin_button = require('./../../assets/images/pangolin-button.png')
const pangolin_m_button = require('./../../assets/images/pangolin-button-mobile.png')
const ksm_icon = require('./../../assets/images/kusama.svg')
const kusama_button = require('./../../assets/images/kusama-button.png')
const kusama_m_button = require('./../../assets/images/kusama-button-mobile.png')
const polkadot_icon = require('./../../assets/images/polkadot.svg')
const polkadot_button = require('./../../assets/images/polkadot-button.png')
const polkadot_m_button = require('./../../assets/images/polkadot-button-mobile.png')

export default [{
    name: 'polkadot',
    value: {
      balances: {
        value: "DOT",
        oldValue: "DOT (old)",
        icon: polkadot_icon
      },
      inflation: "10",
      button: polkadot_button,
      mobileButton: polkadot_m_button,
      hasPrice: true,
      hasVoteBanner: true,
      label: "Polkadot",
      network: "polkadot",
      chain: "Polkadot",
      type: "mainnet",
      color: "#E90979",
      arrowColor: "#E6017A",
      colorMap: ["#E90979", "#F081B9", "#d7d7d7"],
      kton: {
        value: "KTON",
        icon: kton_icon
      },
      domain: {
        value: 'https://polkadot.subscan.io'
      },
      ws: {
        value: "wss://polkadot.subscan.io/socket"
      },
      official_site: {
        value: 'https://polkadot.network/'
      },
      white_paper: {
        value: 'https://polkadot.network/PolkaDotPaper.pdf'
      },
      telegram: {
        value: 'https://t.me/polkadotofficial',
      },
      twitter: {
        value: 'https://twitter.com/Polkadot',
      },
      github: {
        value: 'https://github.com/paritytech/polkadot'
      },
      price_link: {
        value: 'https://coinmarketcap.com/currencies/polkadot-iou/'
      },
      donate: {
        address: '14RYaXRSqb9rPqMaAVp1UZW2czQ6dMNGMbvukwfifi6m8ZgZ'
      }
    }
  },
  {
    name: 'kusama',
    value: {
      balances: {
        value: "KSM",
        icon: ksm_icon
      },
      inflation: "10",
      button: kusama_button,
      mobileButton: kusama_m_button,
      hasPrice: true,
      hasVoteBanner: true,
      label: "Kusama",
      network: "kusama",
      chain: "Kusama",
      type: "mainnet",
      color: "#E90979",
      arrowColor: "#000",
      colorMap: ["#E90979", "#F081B9", "#d7d7d7"],
      kton: {
        value: "KTON",
        icon: kton_icon
      },
      domain: {
        value: 'https://kusama.subscan.io'
      },
      ws: {
        value: "wss://kusama.subscan.io/socket"
      },
      official_site: {
        value: 'https://kusama.network/'
      },
      white_paper: {
        value: ''
      },
      telegram: {
        value: 'https://t.me/kusamanetworkofficial',
      },
      twitter: {
        value: 'https://twitter.com/kusamanetwork',
      },
      github: {
        value: 'https://github.com/paritytech/polkadot/'
      },
      price_link: {
        value: 'https://coinmarketcap.com/currencies/kusama/'
      },
      donate: {
        address: 'Fzs6WWFcAuJhxAVyZa4EN2suxggjidJjV3AzJxKbRHjh2Jc'
      }
    }
  },
  {
    name: 'darwinia',
    value: {
      balances: {
        value: "RING",
        icon: ring_icon
      },
      hasPrice: true,
      inflation: "4",
      hasKton: true,
      button: darwinia_button,
      mobileButton: darwinia_m_button,
      label: "Darwinia CC1",
      network: "darwinia-cc1",
      chain: "DarwiniaCC1",
      type: "mainnet",
      color: "#5930DD",
      arrowColor: "#5930DD",
      colorMap: ["#5930DD", "#A894EB", "#d7d7d7"],
      kton: {
        value: "KTON",
        icon: kton_icon
      },
      power: {
        value: "POWER",
        icon: ring_icon
      },
      domain: {
        value: 'https://darwinia-cc1.subscan.io'
      },
      ws: {
        value: "wss://darwinia-cc1.subscan.io/socket"
      },
      official_site: {
        value: 'https://darwinia.network/'
      },
      white_paper: {
        value: 'https://evolution.l2me.com/darwinia/Darwinia_Genepaper_EN.pdf'
      },
      white_paper_zh: {
        value: 'https://evolution.l2me.com/darwinia/Darwinia_Genepaper_CN.pdf'
      },
      telegram: {
        value: 'https://t.me/DarwiniaNetwork',
      },
      twitter: {
        value: 'https://twitter.com/DarwiniaNetwork',
      },
      github: {
        value: 'https://github.com/darwinia-network'
      },
      donate: {
        address: '2rbREPAhkptwCtdvU5eSGnHgFiyPcehdkXuGqFF916oYCJ7s'
      }
    }
  },
  {
    name: 'crab',
    value: {
      balances: {
        value: "CRING",
        icon: cring_icon
      },
      inflation: "4",
      hasKton: true,
      button: crab_button,
      mobileButton: crab_m_button,
      label: "Darwinia Crab",
      network: "crab",
      chain: "DarwiniaCrab",
      type: "mainnet",
      color: "#5930DD",
      arrowColor: "#5930DD",
      colorMap: ["#5930DD", "#A894EB", "#d7d7d7"],
      kton: {
        value: "CKTON",
        icon: ckton_icon
      },
      power: {
        value: "POWER",
        icon: cring_icon
      },
      domain: {
        value: 'https://crab.subscan.io'
      },
      ws: {
        value: "wss://crab.subscan.io/socket"
      },
      official_site: {
        value: 'https://darwinia.network/'
      },
      white_paper: {
        value: 'https://evolution.l2me.com/darwinia/Darwinia_Genepaper_EN.pdf'
      },
      white_paper_zh: {
        value: 'https://evolution.l2me.com/darwinia/Darwinia_Genepaper_CN.pdf'
      },
      telegram: {
        value: 'https://t.me/DarwiniaNetwork',
      },
      twitter: {
        value: 'https://twitter.com/DarwiniaNetwork',
      },
      github: {
        value: 'https://github.com/darwinia-network'
      },
      donate: {
        address: '5FVFSCANyotNxJM4Crm1LQfsmNQSw3p8H7CRbegN7d5Ex91y'
      }
    }
  },
  {
    name: 'pangolin',
    value: { 
      balances: {
        value: "PRING",
        icon: pring_icon
      },
      hasPrice: true,
      inflation: "4",
      hasKton: true,
      button: pangolin_button,
      mobileButton: pangolin_m_button,
      label: "Pangolin",
      network: "pangolin",
      chain: "pangolin",
      type: "mainnet",
      color: "#5745DE",
      arrowColor: "#5745DE",
      colorMap: ["#5745DE", "#A894EB", "#d7d7d7"],
      kton: {
        value: "PKTON",
        icon: kton_icon
      },
      power: {
        value: "POWER",
        icon: pring_icon
      },
      domain: {
        value: 'https://pangolin.subscan.io'
      },
      ws: {
        value: "wss://pangolin.subscan.io/socket"
      },
      official_site: {
        value: 'https://darwinia.network/'
      },
      white_paper: {
        value: 'https://evolution.l2me.com/darwinia/Darwinia_Genepaper_EN.pdf'
      },
      white_paper_zh: {
        value: 'https://evolution.l2me.com/darwinia/Darwinia_Genepaper_CN.pdf'
      },
      telegram: {
        value: 'https://t.me/DarwiniaNetwork',
      },
      twitter: {
        value: 'https://twitter.com/DarwiniaNetwork',
      },
      github: {
        value: 'https://github.com/darwinia-network'
      },
      donate: {
        address: '2rbREPAhkptwCtdvU5eSGnHgFiyPcehdkXuGqFF916oYCJ7s'
      }
    }
  }
]
