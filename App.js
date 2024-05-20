

import { ethers } from "./ethers-5.6.esm.min.js";

import { abi, contractAddress } from "./constants.js";

const App = {
    contract: {},
    init: async function () {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        App.contract = contract;
        App.bindEvents();

    },

    bindEvents: function () {

        const kycForm = document.getElementById("kycForm");
        const updateKycForm = document.getElementById("updateKycForm");
        const addCustomerForm = document.getElementById("addCustomerForm");
        const addBankForm = document.getElementById("addBankForm");


        kycForm.addEventListener("submit", App.handleCheckKycStatus);
        updateKycForm.addEventListener("submit", App.handleUpdateKycStatus);
        addCustomerForm.addEventListener("submit", App.handleAddCustomer);
        addBankForm.addEventListener("submit", App.handleAddBank);
    },


    handleAddCustomer: async function (event) {
        event.preventDefault();

        const userName = document.getElementById("userName").value;
        const customerData = document.getElementById("customerData").value;

        try {
            await App.contract.addCustomer(userName, customerData);
            alert("Customer added successfully!");
        } catch (error) {
            console.error("Error adding customer:", error);
            alert("Error adding customer. Please try again.");
        }
    },


    handleAddBank: async function (event) {
        event.preventDefault();

        const bankName = document.getElementById("bankName").value;
        const bankAddress = document.getElementById("bankAddress").value;
        const regNum = document.getElementById("regNum").value;
        const complaintsReported = document.getElementById("complaint").value;

        try {
            await App.contract.addBank(bankName, bankAddress, regNum, complaintsReported);
            alert("Bank added successfully!");
            console.error("Error adding bank:", error);
            alert("Error adding bank. Please try again.");
        }
        catch (error) {
            console.error("Error adding bank:", error);
            alert("Error adding bank. Please try again."); // Display error message
        }
    },

    handleCheckKycStatus: async function (event) {
        event.preventDefault();
        const userName = document.getElementById("userName").value;
        try {
            const kycStatus = await App.contract.getKycStatus(userName);
            document.getElementById("statusResult").innerText =
                `KYC Status for ${userName}: ${kycStatus ? 'Verified' : 'Not Verified'}`;
        } catch (error) {
            console.error("Error checking KYC status:", error);
            document.getElementById("statusResult").innerText = "Error checking KYC status.";
        }
    },

    handleUpdateKycStatus: async function (event) {
        event.preventDefault();
        const userName = document.getElementById("userName").value;
        try {
            const transaction = await App.contract.updateKycStatus(userName);
            await transaction.wait();
            const updatedStatus = await App.contract.getKycStatus(userName);
            document.getElementById("updateResult").innerText =
                `KYC Status for ${userName} has been updated to: ${updatedStatus ? 'Verified' : 'Not Verified'}`;
        } catch (error) {
            console.error("Error updating KYC status:", error);
            document.getElementById("updateResult").innerText = "Error updating KYC status.";
        }
    },
};



document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("load", function () {
        App.init();
    });
});
