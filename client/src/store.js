import { writable } from "svelte/store";
import config from "./config";

const blankState = {
  contractAddress:
    config.NETWORK === "local" ? "KT1TqPdKi3mQwbfHWuKxCVZThaamAFwuUV32" : "",
  contractInstance: undefined,
  contractStorage: undefined,
  userAddress: undefined,
  Tezos: undefined,
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
  updateTezos: (Tezos) => {
    store.update((store) => ({ ...store, Tezos }));
  },
};

export default state;
