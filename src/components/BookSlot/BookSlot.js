import React, { useState } from "react";

const BookSlot = ({ slots, handleSlotSelection, isProcessing }) => {
  const [selectedSlot, setSelectedSlot] = useState("");

  const allSlots = [];
  const letters = ["A", "B", "C", "D", "E"];
  for (let letter of letters) {
    for (let i = 1; i <= 10; i++) {
      allSlots.push(`${letter}${i}`);
    }
  }

  const isOccupied = (slot) => slots.includes(slot);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSlot) {
      const [primary, secondary] = selectedSlot.split("");
      handleSlotSelection(primary, secondary);
    } else {
      console.log("No slot selected");
    }
  };

  const selectSlot = (slot) => {
    if (!isOccupied(slot)) {
      setSelectedSlot(slot);
    }
  };

  return (
    <div className="p-8 mt-10 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-5 text-center">
        Select a Slot
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 gap-4 justify-items-center">
          {allSlots.map((slot, index) => (
            <button
              key={index}
              type="button" 
              className={`w-16 h-16 text-center rounded-lg text-white ${
                isOccupied(slot)
                  ? "bg-red-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500"
              }`}
              disabled={isOccupied(slot)}
              onClick={() => selectSlot(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
        {selectedSlot && (
          <p className="mt-4 text-white text-center">
            Selected Slot: {selectedSlot}
          </p>
        )}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isProcessing}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookSlot;
