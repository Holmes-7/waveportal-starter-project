import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "../utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0xE35c353b4b013E83Ad26C541cB76abdAbDF8D8D6";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("Length: ", accounts.length);

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // const provider = new ethers.providers.Web3Provider(ethereum);
        // const signer = provider.getSigner();
        // const wavePortalContract = new ethers.Contract(
        //   contractAddress,
        //   contractABI,
        //   signer
        // );
        // let count = wavePortalContract.getWaveTotal();
        // console.log("Retrived wave count: ", count.toNumber());
        // const waveTxn = await wavePortalContract.wave();
        // console.log("Mining...", waveTxn.hash);
        // await waveTxn.wait();
        // console.log("Mined --", waveTxn.hash);
        // count = wavePortalContract.getWaveTotal();
        // console.log("Retreived total wave count: ", count);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there! I am HaoQing</div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool
          right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={() => wave()}>
          Wave at Me
        </button>
        {!currentAccount && (
          <button className="waveButton" onClick={() => connectWallet()}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
