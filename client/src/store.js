import { writable } from "svelte/store";
import config from "./config";

const blankState = {
  contractAddress:
    config.NETWORK === "local"
      ? "KT1WFEYrrWrYohZfCKmrW7UryYCW5eHXcvN7"
      : "KT1Cu5vdo61TmP8r3zDuW1SXDvJi7FEw4Lea",
  contractInstance: undefined,
  contractStorage: undefined,
  userAddress: undefined,
  userBalance: 0,
  Tezos: undefined,
  tokenInstance: undefined,
  tokenStorage: undefined,
  approvedAddresses: {},
  transactionsHistory: [],
};

const store = writable(blankState);

const state = {
  subscribe: store.subscribe,
  updateContractAddress: (address) => {
    store.update((store) => ({ ...store, contractAddress: address }));
  },
  updateContractInstance: (instance) => {
    store.update((store) => ({ ...store, contractInstance: instance }));
  },
  updateContractStorage: (storage) => {
    store.update((store) => ({ ...store, contractStorage: storage }));
  },
  updateUserAddress: (address) => {
    store.update((store) => ({ ...store, userAddress: address }));
  },
  updateUserBalance: (balance) => {
    store.update((store) => ({ ...store, userBalance: balance }));
  },
  updateTezos: (Tezos) => {
    store.update((store) => ({ ...store, Tezos }));
  },
  updateTokenInstance: (instance) => {
    store.update((store) => ({ ...store, tokenInstance: instance }));
  },
  updateTokenStorage: (storage) => {
    store.update((store) => ({ ...store, tokenStorage: storage }));
  },
  updateApprovedAddresses: (addresses) => {
    store.update((store) => ({
      ...store,
      approvedAddresses: { ...addresses },
    }));
  },
  updateTransactionsHistory: (transactions) => {
    store.update((store) => ({ ...store, transactionsHistory: transactions }));
  },
  formatWithDecimals: (action, amount, decimals) => {
    if (decimals > 0 && amount > 0) {
      if (action === "multiply") {
        // MULTIPLICATION

        let multiplier = "1";
        // creates multiplier
        for (let i = 0; i < decimals; i++) {
          multiplier += "0";
        }
        // converts divisor to number
        multiplier = parseInt(multiplier);

        return amount * multiplier;
      } else if (action === "divide") {
        // DIVISION

        let divisor = "1";
        // creates divisor
        for (let i = 0; i < decimals; i++) {
          divisor += "0";
        }
        // converts divisor to number
        divisor = parseInt(divisor);

        return amount / divisor;
      }
    }

    return amount;
  },
};

export default state;
