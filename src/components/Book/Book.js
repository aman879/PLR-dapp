import React, { useState, useEffect } from "react";
import "../../App.css";
import BookSlot from "../BookSlot/BookSlot";
import Modal from "../Modal/Modal";

const Book = ({ slots, reservedSlot, handleSlotSelection, slotData, getCalculatedFee, cancelReserve, isProcessing }) => {
    console.log("isProcessing", isProcessing)
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setModalOpen] = useState(false);
  const [totalFee, setTotalFee] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const bookedTime = parseInt(slotData[2], 10);
  const totalParkedTime = Math.floor((currentTime.getTime() / 1000) - bookedTime);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h:${mins}m:${secs}s`;
  };

  const handleCancel = async () => {
    const currentTimestamp = Math.floor(currentTime.getTime() / 1000);
    const calculatedFee = await getCalculatedFee(bookedTime, currentTimestamp);
    setTotalFee(calculatedFee);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    await cancelReserve(reservedSlot);
    setModalOpen(false); 
  };

  return (
    <div className="flex justify-center items-center min-h-screen gradient-bg-welcome">
      {reservedSlot.length === 0 || reservedSlot[0].length === 0  ? (
        <BookSlot slots={slots} handleSlotSelection={handleSlotSelection} isProcessing={isProcessing}/>
      ) : (
        <div className="text-white text-center">
          <p>You already have a reserved slot: {reservedSlot.join(", ")}</p>
          <div className="mt-4">
            <p>Booked Time: {new Date(bookedTime * 1000).toLocaleTimeString()}</p>
            <p>Current Time: {currentTime.toLocaleTimeString()}</p>
            <p>Total Parked Time: {formatTime(totalParkedTime)}</p>
          </div>
          <button
            className="mt-5 mb-2 text-pink-300 rounded border-2 hover:bg-pink-600 hover:border-pink-600 text-white font-bold py-2 px-4 rounded-lg"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
        </div>
      )}
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        totalFee={totalFee}
        bookedTime={bookedTime}
        onConfirm={handleConfirm}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default Book;
