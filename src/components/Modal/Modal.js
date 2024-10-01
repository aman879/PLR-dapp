import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, onClose, totalFee, bookedTime, onConfirm, isProcessing }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        const totalSeconds = Math.floor((new Date().getTime() / 1000) - bookedTime);
        setElapsedTime(totalSeconds);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, bookedTime]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h:${mins}m:${secs}s`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-bold">Confirm Cancellation</h2>
        <p>Total Fee: {totalFee} ETH</p>
        <p>Total Time: {formatTime(elapsedTime)}</p>
        <div className="mt-4 flex justify-between">
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded" 
            onClick={onConfirm}
            disabled={isProcessing}
          >
            Confirm
          </button>
          <button 
            className="bg-gray-300 text-black px-4 py-2 rounded" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
