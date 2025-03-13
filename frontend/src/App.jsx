import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const ESCROW_CONTRACT_ADDRESS = "0xf2b166260a727C0a2C716421Ec8Bf81961DC44b7"; // Replace with actual contract address
const ESCROW_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_dealId",
        "type": "uint256"
      }
    ],
    "name": "releasePayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_dealId",
        "type": "uint256"
      }
    ],
    "name": "refund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_payee",
        "type": "address"
      }
    ],
    "name": "depositFunds",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [dealId, setDealId] = useState("");

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } else {
      alert("Please install MetaMask");
    }
  };

  // Deposit Funds
  const depositFunds = async () => {
    if (!window.ethereum) return alert("Please connect to MetaMask");
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const escrowContract = new ethers.Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, signer);

    try {
      const tx = await escrowContract.depositFunds(payee, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      alert("Funds deposited successfully!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed!");
    }
  };

  // Release Payment (Admin Function)
  const releasePayment = async () => {
    if (!window.ethereum) return alert("Please connect to MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const escrowContract = new ethers.Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, signer);

    try {
      const tx = await escrowContract.releasePayment(dealId);
      await tx.wait();
      alert("Payment released successfully!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed!");
    }
  };

  // Refund Funds (Admin Function)
  const refundFunds = async () => {
    if (!window.ethereum) return alert("Please connect to MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const escrowContract = new ethers.Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, signer);

    try {
      const tx = await escrowContract.refund(dealId);
      await tx.wait();
      alert("Funds refunded successfully!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed!");
    }
  };

  return (
    <div className="App">
      <h1>Escrow Platform</h1>
      <button onClick={connectWallet}>
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
      </button>

      <div>
        <h2>Deposit Funds</h2>
        <input
          type="text"
          placeholder="Payee Address"
          value={payee}
          onChange={(e) => setPayee(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={depositFunds}>Deposit</button>
      </div>

      <div>
        <h2>Admin Actions</h2>
        <input
          type="text"
          placeholder="Deal ID"
          value={dealId}
          onChange={(e) => setDealId(e.target.value)}
        />
        <button onClick={releasePayment}>Release Payment</button>
        <button onClick={refundFunds}>Refund</button>
      </div>
    </div>
  );
}

export default App;
