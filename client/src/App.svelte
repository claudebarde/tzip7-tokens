<script>
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";
  import { TezosToolkit } from "@taquito/taquito";
  import { TezBridgeSigner } from "@taquito/tezbridge-signer";
  //import { TezBridgeWallet } from "@taquito/tezbridge-wallet";
  import Landing from "./routes/Landing.svelte";
  import CreateToken from "./routes/CreateToken.svelte";
  import ManageToken from "./routes/ManageToken.svelte";
  import ViewToken from "./routes/ViewToken.svelte";
  import config from "./config";
  import store from "./store";

  const routes = {
    "/": Landing,
    "/create": CreateToken,
    "/manage/:tokenSymbol?": ManageToken,
    "/view/:tokenSymbol": ViewToken
  };

  let error = false;

  let Tezos;

  onMount(async () => {
    // loads storage from AddToken smart contract
    if (config.NETWORK === "local") {
      Tezos = new TezosToolkit("http://localhost:8732");
    } else if (config.NETWORK === "carthage") {
      Tezos = new TezosToolkit("https://testnet-tezos.giganode.io");
    } else {
      console.error("No network specified");
    }
    Tezos.setSignerProvider(new TezBridgeSigner());
    store.updateTezos(Tezos);
    try {
      // creates contract instance
      const contract = await Tezos.contract.at($store.contractAddress);
      store.updateContractInstance(contract);
      // fetches contract storage
      const storage = await contract.storage();
      // makes sure all token symbols are uppercase
      storage.tokensList = storage.tokensList.map(token => token.toUpperCase());
      store.updateContractStorage(storage);
      error = false;
    } catch (err) {
      console.log(err);
      error = true;
    }
  });
</script>

<style>
  .error {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 900;
  }
</style>

<Router {routes} />
{#if error}
  <div class="notification is-danger error">
    The main contract couldn't be found or its storage couldn't be loaded ({$store.contractAddress}).
  </div>
{/if}
