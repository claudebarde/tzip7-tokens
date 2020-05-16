<script>
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";
  import { Tezos } from "@taquito/taquito";
  import { TezBridgeSigner } from "@taquito/tezbridge-signer";
  import Landing from "./routes/Landing.svelte";
  import CreateToken from "./routes/CreateToken.svelte";
  import ManageToken from "./routes/ManageToken.svelte";
  import ViewToken from "./routes/ViewToken.svelte";
  import config from "./config";
  import store from "./store";

  const routes = {
    "/": Landing,
    "/create": CreateToken,
    "/manage": ManageToken,
    "/view": ViewToken
  };

  onMount(async () => {
    // loads storage from AddToken smart contract
    if (config.NETWORK === "local") {
      Tezos.setProvider({
        rpc: "http://localhost:8732",
        signer: new TezBridgeSigner()
      });
    } else if (config.NETWORK === "carthage") {
      Tezos.setProvider({
        rpc: "https://carthagenet.SmartPy.io",
        signer: new TezBridgeSigner()
      });
    } else {
      console.error("No network specified");
    }
    store.updateTezos(Tezos);
    // creates contract instance
    const contract = await Tezos.contract.at($store.contractAddress);
    store.updateContractInstance(contract);
    // fetches contract storage
    const storage = await contract.storage();
    // makes sure all token symbols are uppercase
    storage.tokensList = storage.tokensList.map(token => token.toUpperCase());
    store.updateContractStorage(storage);
  });
</script>

<Router {routes} />
