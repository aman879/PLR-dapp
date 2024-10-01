// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.27;

contract ParkingReservation {
    address private owner;
    uint256 public reservationFeePerMin;
    uint8 public totalPrimarySlots; 
    uint8 public totalSecondarySlots;

    struct Slot {
        bool isOccupied;
        address reserver;
        uint256 startTime;
    }

    mapping(string => mapping(uint8 => Slot)) public slots;
    mapping(address => mapping(string => mapping(uint8 => Slot))) public reservedByAddress;

    modifier validSlot(string memory primary, uint8 secondary) {
        require(secondary > 0 && secondary <= totalSecondarySlots, "Invalid secondary parking spot.");
        require(isValidPrimary(primary), "Invalid primary parking spot.");
        _;
    }

    constructor(uint8 _totalPrimarySlots, uint8 _totalSecondarySlots, uint256 _reservationFeePerMin) {
        owner = msg.sender;
        totalPrimarySlots = _totalPrimarySlots;
        totalSecondarySlots = _totalSecondarySlots;
        reservationFeePerMin = _reservationFeePerMin;
    }

    function isValidPrimary(string memory primary) internal pure returns (bool) {
        return (keccak256(abi.encodePacked(primary)) == keccak256(abi.encodePacked("A")) ||
                keccak256(abi.encodePacked(primary)) == keccak256(abi.encodePacked("B")) ||
                keccak256(abi.encodePacked(primary)) == keccak256(abi.encodePacked("C")) ||
                keccak256(abi.encodePacked(primary)) == keccak256(abi.encodePacked("D")) ||
                keccak256(abi.encodePacked(primary)) == keccak256(abi.encodePacked("E")));
    }

    function setSlot(string memory primary, uint8 secondary) external validSlot(primary, secondary) {
        require(!slots[primary][secondary].isOccupied, "Slot is already occupied.");

        slots[primary][secondary] = Slot({
            isOccupied: true,
            reserver: msg.sender,
            startTime: block.timestamp
        });

        reservedByAddress[msg.sender][primary][secondary] = slots[primary][secondary];
    }

    function removePark(string memory primary, uint8 secondary) external validSlot(primary, secondary) {
        require(slots[primary][secondary].isOccupied, "Slot is not occupied.");
        require(slots[primary][secondary].reserver == msg.sender, "Not authorized to remove.");

        // uint256 fee = getCalculatedFee(primary, secondary);
        
        slots[primary][secondary].isOccupied = false;
        reservedByAddress[msg.sender][primary][secondary] = Slot(false, address(0), 0);
        
        // require(payForSlot(fee), "Payment failed.");
    }

    function getCalculatedFee(uint256 startTime, uint256 endTime) public view returns (uint256) {
        require(startTime < endTime, "Start time should be less than end time");

        uint256 duration = endTime - startTime; 
        uint256 minute = (duration / 60) + (duration % 60 > 0 ? 1 : 0); 

        return minute * reservationFeePerMin / 60;
        
    }

    function getReservedSlotsByAddress(address user) external view returns (string[] memory primarySlots, uint8[] memory secondarySlots) {
        uint256 count = 0;

        for (uint8 i = 0; i < totalPrimarySlots; i++) {
            string memory primary = getPrimaryKey(i);
            for (uint8 j = 1; j <= totalSecondarySlots; j++) {
                if (reservedByAddress[user][primary][j].isOccupied) {
                    count++;
                }
            }
        }

        primarySlots = new string[](count);
        secondarySlots = new uint8[](count);
        uint256 index = 0;

        for (uint8 i = 0; i < totalPrimarySlots; i++) {
            string memory primary = getPrimaryKey(i);
            for (uint8 j = 1; j <= totalSecondarySlots; j++) {
                if (reservedByAddress[user][primary][j].isOccupied) {
                    primarySlots[index] = primary;
                    secondarySlots[index] = j;
                    index++;
                }
            }
        }
    }

    function getPrimaryKey(uint8 index) internal pure returns (string memory) {
        require(index < 5, "Invalid primary index.");
        return index == 0 ? "A" :
               index == 1 ? "B" :
               index == 2 ? "C" :
               index == 3 ? "D" :
               "E";
    }

    function getOccupiedSlots() external view returns (string[] memory slotIdentifiers) {
        uint256 totalOccupied = 0;

        for (uint8 i = 0; i < totalPrimarySlots; i++) {
            string memory primary = getPrimaryKey(i);
            for (uint8 j = 1; j <= totalSecondarySlots; j++) {
                if (slots[primary][j].isOccupied) {
                    totalOccupied++;
                }
            }
        }
        
        slotIdentifiers = new string[](totalOccupied);
        
        uint256 index = 0;
        for (uint8 i = 0; i < totalPrimarySlots; i++) {
            string memory primary = getPrimaryKey(i);
            for (uint8 j = 1; j <= totalSecondarySlots; j++) {
                if (slots[primary][j].isOccupied) {
                    slotIdentifiers[index] = string(abi.encodePacked(primary, uint2str(j)));
                    index++;
                }
            }
        }
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            bstr[--k] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }

    receive() external payable {}
}
