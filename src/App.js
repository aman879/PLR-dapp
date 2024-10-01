import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Book from "./components/Book/Book";
import "./App.css";
import Home from "./components/Home/Home";
import { ethers } from "ethers";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PLR from "./contracts/contract-address-holesky.json";
import ParkingReservationAtrifacts from "./contracts/ParkingReservation.json";

const App = () => {
  const [route, setRoute] = useState("home");
  const [wallet, setWallet] = useState(false);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(undefined);
  const [slots, setSlots] = useState([]);
  const [reservedSlot, setReservedSlot] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [reload, setReload]= useState(true);
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (window.ethereum === undefined) {
      setWallet(false);
      console.log("Wallet not detected");
    } else {
      setWallet(true);
      switchNetwork();
      handleAccountChange();
      handleNetworkChange(); 
    }
  }, []); 

  useEffect(() => {
    if (connected && contract) {
      loadSlots();
    }
  }, [connected, contract, reload]); 

  const switchNetwork = async () => {
    const chainIdHex = `0x4268`;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error) {
      console.error("Error switching network:", error);
    }
  };

  const handleAccountChange = () => {
    window.ethereum.on("accountsChanged", async (accounts) => {
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const _walletAddress = accounts[0];

        const _contract = new ethers.Contract(
          PLR.PLR,
          ParkingReservationAtrifacts.abi,
          signer
        );

        setWalletAddress(_walletAddress);
        setContract(_contract);
        console.log("Account changed:", _walletAddress);
      } else {
        setWalletAddress("");
        setConnected(false);
        console.log("Wallet disconnected");
      }
    });
  };

  const handleNetworkChange = () => {
    window.ethereum.on("chainChanged", async (chainId) => {
      // const sepoliaChainId = "0xaa36a7"
      const holeskyChainId = "0x4268";
      // const hardhatChainId = "0x7a69";
      if (chainId !== holeskyChainId) {
        await switchNetwork();
      } else {
        console.log("Connected to the correct network:", chainId);
      }
    });
  };

  const onRouteChange = (route) => {
    setRoute(route);
  };

  const onConnect = async () => {
    if (!connected) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const _walletAddress = await signer.getAddress();

        const _contract = new ethers.Contract(
          PLR.PLR,
          ParkingReservationAtrifacts.abi,
          await provider.getSigner(0)
        );

        setConnected(true);
        setWalletAddress(_walletAddress);
        setContract(_contract);
      } catch (error) {
        console.error("Connection Error:", error);
      }
    }
  };

  const getCalculatedFee = async (startTime, endtime) => {
    if(connected && contract) {
      try {
        const fee = await contract.getCalculatedFee(startTime, endtime);
        const feeInEth = ethers.formatEther(fee);
        return feeInEth
      }catch (e) {
        console.log(e)
      }
    }
  }

  const loadSlots = async () => {
    if (connected && contract) {
      console.log("Loading slots...");
      console.log(contract)
      try {
          const slots = await contract.getOccupiedSlots();
          const reservedSlotByAddress = await contract.getReservedSlotsByAddress(walletAddress);
          if(reservedSlotByAddress.length > 0) {
            if(reservedSlotByAddress[0].length > 0) {
              const data = await contract.reservedByAddress(walletAddress, reservedSlotByAddress[0][0], reservedSlotByAddress[1][0]);
              setSlotData(data)
            }
          }
          setSlots(slots);
          setReservedSlot(reservedSlotByAddress);
          setReload(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleSlotSelection = async (primary, secondary) => {
    if(connected && contract) {
      try {
        setIsProcessing(true);
        toast.info("Transaction processing", {
          position: "top-center"
        })
        const tx = await contract.setSlot(primary, Number(secondary))
        const res = await tx.wait()
        if(res.status) {
          toast.success(`Slot no: ${primary,secondary}.`, {
            position: "top-center"
          })
          await loadSlots();
          onRouteChange("home");
        }
      } catch(e) {
        console.log(e)
      } finally {
        setIsProcessing(false);
      }
    }
  }

  const cancelReserve = async (reservedSlot) => {
    if(connected && contract) {
      try {
        setIsProcessing(true);
        toast.info("Transaction processing", {
          position: "top-center"
        })
        const tx = await contract.removePark(reservedSlot[0][0], reservedSlot[1][0]);
        const res = await tx.wait();
        if(res.status) {
          toast.success("Payemnt succesfull.", {
            position: "top-center"
          })
          window.location.reload();
        }
      } catch(e) {
        console.log(e)
        toast.error("Canceling failed.", {
          position: "top-center"
        });
      } finally {
        setIsProcessing(false)
      }
    }
  }

  return (
    <div>
      <ToastContainer />
      <div className="App min-h-screen">
        <div className="gradient-bg-welcome h-screen w-screen">
          <Navbar
            onRouteChange={onRouteChange}
            connect={onConnect}
            address={walletAddress}
            wallet={wallet}
            connected={connected}
          />
          {route === "book" ? (
            <Book slots={slots} reservedSlot={reservedSlot} handleSlotSelection={handleSlotSelection} slotData={slotData} getCalculatedFee={getCalculatedFee} cancelReserve={cancelReserve} isProcessing={isProcessing}/>
          ) : route === "home" ? (
            <Home onRouteChange={onRouteChange} />
          ) : (
            <p className="text-center text-white">Not Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
