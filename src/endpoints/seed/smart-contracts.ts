import type { Payload } from 'payload'

export const seedSmartContracts = async (
  payload: Payload,
  companyMap: Record<string, any>,
  transactionMap: Record<string, any>,
): Promise<void> => {
  const existingDocs = await payload.find({
    collection: 'smart-contracts' as any,
    limit: 1,
  })

  if (existingDocs.docs.length === 0) {
    // Export Escrow Template
    const exportEscrowTemplate = await payload.create({
      collection: 'smart-contracts' as any,
      data: {
        title: 'Export Escrow Smart Contract - Base Template',
        description:
          'Standard export escrow contract template with milestone-based verification and payment release',
        version: '1.2.0',
        contractType: 'export-escrow',
        templateOrInstance: 'template',
        blockchainNetwork: 'polygon',
        status: 'reviewed',
        sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title ExportEscrowContract
 * @dev Manages escrow for international trade exports with oracle-verified milestones
 */
contract ExportEscrowContract {
    // Contract participants
    address public importer;
    address public exporter;
    address public escrowAgent;
    
    // Financial details
    uint256 public totalAmount;
    uint256 public totalReleased;
    
    // Contract state
    bool public contractActive = true;
    uint8 public currentMilestone = 0;
    uint8 public totalMilestones;
    
    // Oracle management
    mapping(address => bool) public authorizedOracles;
    uint8 public requiredOracleValidations;
    
    // Milestone management
    struct Milestone {
        string description;
        uint256 paymentPercentage;
        bool completed;
        uint256 completedTimestamp;
        mapping(address => bool) oracleValidations;
        uint8 validationsReceived;
    }
    
    // Events
    event ContractCreated(address indexed importer, address indexed exporter, uint256 amount);
    event MilestoneCompleted(uint8 milestoneId, uint256 timestamp);
    event PaymentReleased(uint8 milestoneId, uint256 amount);
    event ContractCompleted(uint256 timestamp);
    event ContractCancelled(uint256 timestamp, string reason);
    event DisputeRaised(address initiator, string reason);
    event DisputeResolved(address resolver, string resolution);
    
    // Array of milestones not part of this simplified template
    
    /**
     * @dev Constructor sets up the escrow contract with participants and terms
     * @param _exporter Address of the exporting entity
     * @param _escrowAgent Address of the escrow agent (IntelliTrade platform)
     * @param _totalMilestones Number of verification milestones in this contract
     * @param _requiredOracleValidations Minimum oracle validations required per milestone
     */
    constructor(
        address _exporter,
        address _escrowAgent,
        uint8 _totalMilestones,
        uint8 _requiredOracleValidations
    ) payable {
        importer = msg.sender;
        exporter = _exporter;
        escrowAgent = _escrowAgent;
        totalAmount = msg.value;
        totalMilestones = _totalMilestones;
        requiredOracleValidations = _requiredOracleValidations;
        
        // Register contract creation
        emit ContractCreated(importer, exporter, totalAmount);
    }
    
    /**
     * @dev Add authorized oracle
     * @param oracleAddress Address of the oracle to authorize
     */
    function addOracle(address oracleAddress) external {
        require(msg.sender == escrowAgent, "Only escrow agent can add oracles");
        authorizedOracles[oracleAddress] = true;
    }
    
    /**
     * @dev Oracle submits verification for a milestone
     * @param milestoneId The ID of the milestone being verified
     * @param evidenceHash IPFS hash of the evidence document/photo
     */
    function verifyMilestone(uint8 milestoneId, bytes32 evidenceHash) external {
        // Implementation not included in template preview
    }
    
    /**
     * @dev Release payment for a completed milestone
     * @param milestoneId The ID of the completed milestone
     */
    function releasePayment(uint8 milestoneId) internal {
        // Implementation not included in template preview
    }
    
    /**
     * @dev Complete the contract when all milestones are verified
     */
    function completeContract() internal {
        // Implementation not included in template preview
    }
    
    /**
     * @dev Allow dispute resolution by escrow agent
     * @param resolution The resolution decision
     * @param paymentToExporter Amount to release to exporter
     */
    function resolveDispute(string calldata resolution, uint256 paymentToExporter) external {
        // Implementation not included in template preview
    }
}`,
        abiInterface: `[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_exporter",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_escrowAgent",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_totalMilestones",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "_requiredOracleValidations",
        "type": "uint8"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "ContractCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ContractCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "importer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "exporter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ContractCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "initiator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "DisputeRaised",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "resolver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "resolution",
        "type": "string"
      }
    ],
    "name": "DisputeResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "milestoneId",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "MilestoneCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "milestoneId",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PaymentReleased",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "oracleAddress",
        "type": "address"
      }
    ],
    "name": "addOracle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "authorizedOracles",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractActive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentMilestone",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "escrowAgent",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "exporter",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "importer",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requiredOracleValidations",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "resolution",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "paymentToExporter",
        "type": "uint256"
      }
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalMilestones",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalReleased",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "milestoneId",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "evidenceHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]`,
        parameters: [
          {
            name: 'exporter',
            description: 'Address of exporting entity',
            dataType: 'address',
          },
          {
            name: 'escrowAgent',
            description: 'Address of IntelliTrade platform',
            dataType: 'address',
          },
          {
            name: 'totalMilestones',
            description: 'Number of verification steps',
            dataType: 'uint256',
          },
          {
            name: 'requiredOracleValidations',
            description: 'Minimum validations required per milestone',
            dataType: 'uint256',
          },
        ],
        slug: 'export-escrow-smart-contract-base-template',
      } as any,
    })

    // Trade Finance Template
    const tradeFinanceTemplate = await payload.create({
      collection: 'smart-contracts' as any,
      data: {
        title: 'Trade Finance Contract - Base Template',
        description:
          'Advanced trade finance contract with factoring capability and recourse mechanisms',
        version: '1.0.1',
        contractType: 'trade-finance',
        templateOrInstance: 'template',
        blockchainNetwork: 'polygon',
        status: 'reviewed',
        sourceCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title TradeFinanceContract
 * @dev Manages trade finance with factoring capability for exporters
 */
contract TradeFinanceContract {
    // Contract participants
    address public importer;
    address public exporter;
    address public financier;
    address public platform;
    
    // Financial details
    uint256 public totalAmount;
    uint256 public advanceRate; // 85% in basis points (8500)
    uint256 public advanceAmount;
    uint256 public remainingAmount;
    uint256 public platformFee; // in basis points
    uint256 public financierFee; // in basis points
    
    // Contract state
    enum Status { Created, AdvancePaid, Completed, Defaulted, Cancelled }
    Status public contractStatus;
    bool public recourseActive;
    
    // Oracle management
    mapping(address => bool) public authorizedOracles;
    
    // Events
    event ContractCreated(address indexed importer, address indexed exporter, address indexed financier, uint256 amount);
    event AdvancePaymentReleased(uint256 amount, uint256 timestamp);
    event RemainingPaymentReleased(uint256 amount, uint256 timestamp);
    event ContractCompleted(uint256 timestamp);
    event RecourseActivated(uint256 timestamp, string reason);
    event RecourseResolved(uint256 timestamp);
    
    /**
     * @dev Constructor sets up the trade finance contract
     * @param _exporter Address of the exporting entity
     * @param _financier Address of the financing entity
     * @param _advanceRate Percentage of total to advance (in basis points)
     * @param _platformFee Fee charged by IntelliTrade (in basis points)
     * @param _financierFee Fee charged by financier (in basis points)
     */
    constructor(
        address _exporter,
        address _financier,
        uint256 _advanceRate,
        uint256 _platformFee,
        uint256 _financierFee
    ) payable {
        importer = msg.sender;
        exporter = _exporter;
        financier = _financier;
        platform = msg.sender; // In production would be IntelliTrade platform
        
        totalAmount = msg.value;
        advanceRate = _advanceRate;
        platformFee = _platformFee;
        financierFee = _financierFee;
        
        advanceAmount = (totalAmount * advanceRate) / 10000;
        remainingAmount = totalAmount - advanceAmount;
        
        contractStatus = Status.Created;
        recourseActive = false;
        
        emit ContractCreated(importer, exporter, financier, totalAmount);
    }
    
    /**
     * @dev Release advance payment to exporter after initial verification
     */
    function releaseAdvancePayment() external {
        // Implementation not included in template preview
    }
    
    /**
     * @dev Oracle confirms final delivery to release remaining payment
     */
    function confirmDelivery() external {
        // Implementation not included in template preview
    }
    
    /**
     * @dev Activate recourse if contract defaults
     */
    function activateRecourse(string calldata reason) external {
        // Implementation not included in template preview
    }
    
    /**
     * @dev Resolve recourse situation
     */
    function resolveRecourse() external {
        // Implementation not included in template preview
    }
}`,
        abiInterface: `[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_exporter",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_financier",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_advanceRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_platformFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_financierFee",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "AdvancePaymentReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ContractCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "importer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "exporter",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "financier",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ContractCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "RemainingPaymentReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "reason",
        "type": "string"
      }
    ],
    "name": "RecourseActivated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "RecourseResolved",
    "type": "event"
  }
]`,
        parameters: [
          {
            name: 'exporter',
            description: 'Address of exporting entity',
            dataType: 'address',
          },
          {
            name: 'financier',
            description: 'Address of financing entity',
            dataType: 'address',
          },
          {
            name: 'advanceRate',
            description: 'Percentage advance payment in basis points (8500 = 85%)',
            dataType: 'uint256',
            value: '8500',
          },
          {
            name: 'platformFee',
            description: 'IntelliTrade fee in basis points (100 = 1%)',
            dataType: 'uint256',
            value: '100',
          },
          {
            name: 'financierFee',
            description: 'Financier fee in basis points (200 = 2%)',
            dataType: 'uint256',
            value: '200',
          },
        ],
        slug: 'trade-finance-contract-base-template',
      } as any,
    })

    // Instance for Don Hugo Peanut Export
    const donHugoInstance = await payload.create({
      collection: 'smart-contracts' as any,
      data: {
        title: 'Don Hugo Peanut Export - Contract Instance',
        description:
          'Smart contract instance for Don Hugo peanut export to Global Nut Distributors',
        version: '1.2.0',
        contractType: 'export-escrow',
        templateOrInstance: 'instance',
        associatedTransaction: transactionMap['Don Hugo Peanut Export - Batch #1'],
        parentTemplate: exportEscrowTemplate.id,
        blockchainNetwork: 'polygon',
        contractAddress: '0x7a3E8F126a5D91C58EA6F53EaB37C6439E63F1F9',
        status: 'active',
        deploymentDate: '2025-04-10T08:00:00Z',
        deploymentTransaction:
          '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
        gasUsed: 3245678,
        parameters: [
          {
            name: 'exporter',
            description: 'Address of Don Hugo Farms',
            dataType: 'address',
            value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          },
          {
            name: 'escrowAgent',
            description: 'Address of IntelliTrade platform',
            dataType: 'address',
            value: '0x8b3F9C12E8A0E2D33d9F4B1F5A2C1E6F7b8D9E0F',
          },
          {
            name: 'totalMilestones',
            description: 'Number of verification steps',
            dataType: 'uint256',
            value: '5',
          },
          {
            name: 'requiredOracleValidations',
            description: 'Minimum validations required per milestone',
            dataType: 'uint256',
            value: '2',
          },
        ],
        events: [
          {
            eventName: 'ContractCreated',
            description: 'Contract was deployed and funded',
            emittedAt: '2025-04-10T08:05:23Z',
            transactionHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
            blockNumber: 42567890,
            parameters: [
              {
                name: 'importer',
                value: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
              },
              {
                name: 'exporter',
                value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
              },
              {
                name: 'amount',
                value: '75000000000000000000000',
              },
            ],
          },
          {
            eventName: 'MilestoneCompleted',
            description: 'Production verification completed',
            emittedAt: '2025-04-12T10:23:45Z',
            transactionHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
            blockNumber: 42571234,
            parameters: [
              {
                name: 'milestoneId',
                value: '1',
              },
              {
                name: 'timestamp',
                value: '1744956225',
              },
            ],
          },
          {
            eventName: 'PaymentReleased',
            description: 'Initial payment released to exporter',
            emittedAt: '2025-04-12T10:23:57Z',
            transactionHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
            blockNumber: 42571236,
            parameters: [
              {
                name: 'milestoneId',
                value: '1',
              },
              {
                name: 'amount',
                value: '11250000000000000000000',
              },
            ],
          },
        ],
        slug: 'don-hugo-peanut-export-contract-instance',
      } as any,
    })

    // Instance for Colombian Coffee Export
    const coffeeExportInstance = await payload.create({
      collection: 'smart-contracts' as any,
      data: {
        title: 'Colombian Coffee Export - Contract Instance',
        description:
          'Smart contract instance for Colombian Coffee Cooperative export to Tokyo Bean Trading',
        version: '1.2.0',
        contractType: 'export-escrow',
        templateOrInstance: 'instance',
        associatedTransaction: transactionMap['Global Coffee Export - Colombia to Japan'],
        parentTemplate: exportEscrowTemplate.id,
        blockchainNetwork: 'polygon',
        contractAddress: '0x8b3F9C12E8A0E2D33d9F4B1F5A2C1E6F7b8D9E0F',
        status: 'completed',
        deploymentDate: '2025-03-10T09:30:00Z',
        deploymentTransaction: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4',
        gasUsed: 3156789,
        parameters: [
          {
            name: 'exporter',
            description: 'Address of Colombian Coffee Cooperative',
            dataType: 'address',
            value: '0xD02aaA39b223FE8D0A0e5C4F27eAD9083C756Dd3',
          },
          {
            name: 'escrowAgent',
            description: 'Address of IntelliTrade platform',
            dataType: 'address',
            value: '0x8b3F9C12E8A0E2D33d9F4B1F5A2C1E6F7b8D9E0F',
          },
          {
            name: 'totalMilestones',
            description: 'Number of verification steps',
            dataType: 'uint256',
            value: '5',
          },
          {
            name: 'requiredOracleValidations',
            description: 'Minimum validations required per milestone',
            dataType: 'uint256',
            value: '2',
          },
        ],
        events: [
          {
            eventName: 'ContractCreated',
            description: 'Contract was deployed and funded',
            emittedAt: '2025-03-10T09:35:15Z',
            transactionHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5',
            blockNumber: 42450123,
            parameters: [
              {
                name: 'importer',
                value: '0xA0F8bf6A479f320ead074411a4B0e7944Ea8c9D2',
              },
              {
                name: 'exporter',
                value: '0xD02aaA39b223FE8D0A0e5C4F27eAD9083C756Dd3',
              },
              {
                name: 'amount',
                value: '120000000000000000000000',
              },
            ],
          },
          {
            eventName: 'ContractCompleted',
            description: 'All milestones verified and payments completed',
            emittedAt: '2025-04-17T10:45:27Z',
            transactionHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
            blockNumber: 42589567,
            parameters: [
              {
                name: 'timestamp',
                value: '1745671927',
              },
            ],
          },
        ],
        slug: 'colombian-coffee-export-contract-instance',
      } as any,
    })

    console.log('✅ Seed smart contracts completed')
  } else {
    console.log('🌱 Smart contracts already exist, skipping seed')
  }
}
