const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { ethers } = require("ethers");

const RepTrackerModule = buildModule("RepTrackerModule", (m) => {
    // Deploy the RepTracker contract
    const repTracker = m.contract("RepTracker");


    return {
        repTracker
    };
});

module.exports = RepTrackerModule;

