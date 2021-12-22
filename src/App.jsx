import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xF59Cc9D078f20d87Fd69dFaAC0faCc4f49872DFb";
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
        await getAllWaves();
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
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrived wave count: ", count.toNumber());

        const waveTxn = await wavePortalContract.wave("This is a message");
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retreived total wave count: ", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const waves = await wavePortalContract.getAllWaves();

        // let wavesCleaned = [];
        // waves.forEach((wave) => {
        //   wavesCleaned.push({
        //     address: wave.waver,
        //     timestamp: new Date(wave.timestamp * 1000),
        //     message: wave.message,
        //   });
        // });

        const wavesCleaned = waves.map((wave) => {
          return {
            address: wave.address,
            timestamp: wave.timestamp,
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (err) {}
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    let waveContract;

    const onNewWave = (from, timestamp, message) => {
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      waveContract = new ethers.Contract(contractAddress, contractABI, signer);
      waveContract.on("NewWave", onNewWave);
    }
    return () => {
      if (waveContract) {
        waveContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">👋 Hey there!</div>

        <div className="bio">
          I am Holmes and I worked on self-driving cars so that's pretty cool
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
        {allWaves.map((wave, index) => (
          <div
            style={{
              backgroundColor: "oldlace",
              marginTop: "16px",
              padding: "8px",
            }}
            key={index}
          >
            <div>Address: {wave.address}</div>
            <div>Time: {wave.timestamp.toString()}</div>
            <div>Message: {wave.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
