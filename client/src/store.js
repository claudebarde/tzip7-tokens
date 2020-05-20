import { writable } from "svelte/store";
import config from "./config";

const blankState = {
  contractAddress:
    config.NETWORK === "local" ? "KT1SUeQ8GpFYgSVbEW9LGmZDgREja8Lvpr1E" : "",
  contractInstance: undefined,
  contractStorage: undefined,
  userAddress: undefined,
  Tezos: undefined,
  tokenInstance: undefined,
  tokenStorage: undefined,
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
  updateTokenInstance: (instance) => {
    store.update((store) => ({ ...store, tokenInstance: instance }));
  },
  updateTokenStorage: (storage) => {
    store.update((store) => ({ ...store, tokenStorage: storage }));
  },
};

export default state;
