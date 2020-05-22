<script>
  import { onMount } from "svelte";
  import { MichelsonMap } from "@taquito/taquito";
  import { push } from "svelte-spa-router";
  import Navbar from "../components/Navbar/Navbar.svelte";
  import store from "../store";
  import michelson from "../michelson/michelson.json";

  let tokenName = "";
  let tokenSymbol = "";
  let tokenDecimals = 0;
  let openConfirmModal = false;
  let creatingNewToken = false;
  let tokenNameError = false;
  let tokenSymbolError = false;
  let firstTx = false;
  let waitingSecondTx = false;
  let secondTx = false;

  const updateTokenName = event => {
    const input = event.target.value
      .replace(/[.,\/\?#!$%\^&\*;:{}=\-_`~()@]/g, "")
      .toUpperCase();
    if (input.length < 15) {
      tokenNameError = false;
      tokenName = input;
    } else {
      tokenName = input.slice(0, 15);
    }
  };

  const updateTokenSymbol = event => {
    const input = event.target.value
      .replace(/[.,\/\?#!$%\^&\*;:{}=\-_`~()@]/g, "")
      .toUpperCase();
    if ($store.contractStorage.tokensList.includes(input)) {
      tokenSymbolError = true;
      tokenSymbol = input;
    } else {
      if (input.length < 6) {
        tokenSymbolError = false;
        tokenSymbol = input;
      } else {
        tokenSymbolError = true;
        tokenSymbol = input.slice(0, 6);
      }
    }
  };

  const originateContract = async () => {
    creatingNewToken = true;
    firstTx = true;
    // deploying contract for new token
    try {
      const originationOp = await $store.Tezos.contract.originate({
        code: michelson,
        storage: {
          owner: $store.userAddress,
          metadata: {
            decimals: tokenDecimals,
            extras: new MichelsonMap(),
            name: tokenName,
            symbol: tokenSymbol,
            token_id: 0
          },
          buyPrice: 0,
          tokenBuyPool: 0,
          totalSupply: 0,
          ledger: new MichelsonMap()
        }
      });
      const contract = await originationOp.contract();
      console.log("New token address:", contract.address);
      if (contract.address) {
        firstTx = false;
        waitingSecondTx = true;
        // saving token address
        const op = await $store.contractInstance.methods
          .main(tokenName, tokenSymbol, contract.address)
          .send();
        waitingSecondTx = false;
        secondTx = true;
        await op.confirmation();
        // fetching new storage
        const storage = await $store.contractInstance.storage();
        store.updateContractStorage(storage);
        // redirect to manage page
        push(`/manage/${tokenSymbol}`);
      } else {
        firstTx = false;
        waitingSecondTx = false;
        secondTx = false;
        throw new Error("No generated address");
      }
    } catch (error) {
      firstTx = false;
      waitingSecondTx = false;
      secondTx = false;
      console.log("Error:", error);
      creatingNewToken = false;
    }
  };

  onMount(() => {
    store.updateTokenInstance(undefined);
    store.updateTokenStorage(undefined);
  });
</script>

<style>
  .home-img {
    max-width: 400px;
  }

  .factory-col {
    padding: 50px 10px;
  }

  .box {
    height: 100%;
  }

  @media only screen and (max-width: 1024px) {
    .interface {
      min-height: 500px;
      flex-direction: column;
    }

    .interface__navbar {
      height: 60px;
      width: 100%;
    }
  }
</style>

{#if openConfirmModal}
  <div class="modal is-active">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Confirm Token Creation?</p>
        <button
          class="delete"
          aria-label="close"
          on:click={() => (openConfirmModal = false)} />
      </header>
      <section class="modal-card-body">
        <p class="title is-5">This is the token you are about to create:</p>
        <div class="columns is-mobile is-centered">
          <div class="column is-one-fourth">Token Name:</div>
          <div class="column is-one-fourth">{tokenName}</div>
          <div class="column is-one-fourth">Token Symbol:</div>
          <div class="column is-one-fourth">{tokenSymbol}</div>
        </div>
        <div class="columns is-mobile is-centered">
          <div class="column is-one-fourth">Token Decimals:</div>
          <div class="column is-one-fourth">{tokenDecimals}</div>
          <div class="column is-one-fourth">Admin Address:</div>
          <div class="column is-one-fourth">
            {$store.userAddress.slice(0, 7) + '...' + $store.userAddress.slice(-7)}
          </div>
        </div>
        <p class="title is-5">Your confirmation requires 2 transactions:</p>
        <p>
          During the first transaction, your token will be created and added to
          the blockchain.
        </p>
        <p>
          During the second transaction, your token address will be added to the
          main contract.
        </p>
        <br />
        <p>
          Do not skip the second transaction or the other users won't be able to
          find your token!
        </p>
        <br />
        {#if firstTx}
          <div class="message is-info">
            <div class="message-body">Creating your token, please wait...</div>
          </div>
        {/if}
        {#if waitingSecondTx}
          <div class="message is-warning">
            <div class="message-body">
              Please confirm the second transaction in the TezBridge window.
            </div>
          </div>
        {/if}
        {#if secondTx}
          <div class="message is-info">
            <div class="message-body">Saving your token, please wait...</div>
          </div>
        {/if}
      </section>
      <footer class="modal-card-foot" style="justify-content:flex-end">
        <button
          class="button is-success"
          class:is-loading={creatingNewToken}
          on:click={() => {
            creatingNewToken = true;
            originateContract();
          }}>
          Confirm
        </button>
        <button
          class="button is-danger"
          disabled={creatingNewToken}
          on:click={() => (openConfirmModal = false)}>
          Cancel
        </button>
      </footer>
    </div>
  </div>
{/if}
<div class="interface">
  <div class="interface__navbar">
    <Navbar />
  </div>
  <div class="interface__main">
    <div class="columns is-centered" style="margin:0rem">
      <div class="column is-10">
        <section class="section">
          <div class="container">
            <div class="box">
              <div class="columns">
                <div class="column is-half has-text-centered factory-col">
                  <div class="title is-4">Welcome to the Token Factory!</div>
                  <p>
                    You are now ready to create your own token on the Tezos
                    blockchain!
                  </p>
                  <br />
                  <p>
                    The following steps will show you how tokens are created,
                    what kind of information they contain, how to mint new
                    tokens and how to transfer them.
                  </p>
                  <br />
                  <p>Let's get started!</p>
                </div>
                <div class="column is-half has-text-centered factory-col">
                  <img
                    src="images/undraw_factory.svg"
                    alt="factory"
                    class="home-img" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section class="section">
          <div class="container">
            <div class="columns is-multiline">
              <div class="column is-one-third-desktop is-half-tablet">
                <div class="box">
                  <div class="title is-5">Give a name to your token</div>
                  <div class="subtitle is-6">
                    Choose a unique short name to identify your token:
                  </div>
                  <input
                    type="text"
                    class="input"
                    class:is-danger={tokenNameError}
                    class:is-success={tokenName.length > 0 && tokenName.length < 15 && !tokenNameError}
                    value={tokenName}
                    on:input={updateTokenName}
                    maxlength="14"
                    placeholder="Your token name" />
                </div>
              </div>
              <div class="column is-one-third-desktop is-half-tablet">
                <div class="box">
                  <div class="title is-5">Choose a symbol</div>
                  <div class="subtitle is-6">
                    The symbol must be short, maximum 5 characters and unique:
                  </div>
                  <input
                    type="text"
                    class="input"
                    class:is-danger={tokenSymbolError}
                    class:is-success={tokenSymbol.length > 0 && tokenSymbol.length < 6 && !tokenSymbolError}
                    value={tokenSymbol}
                    on:input={updateTokenSymbol}
                    maxlength="5"
                    placeholder="Your token symbol, for example MYTEZ" />
                </div>
              </div>
              <div class="column is-one-third-desktop is-half-tablet">
                <div class="box">
                  <div class="title is-5">Choose a decimal value</div>
                  <div class="subtitle is-6">
                    Is your token divisible? How many decimals do you want to
                    allow?
                  </div>
                  <input
                    type="number"
                    class="input"
                    bind:value={tokenDecimals}
                    placeholder="Your token decimals" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {#if !$store.userAddress}
          <section class="section">
            <div class="container">
              <div class="box">
                <p class="title is-6">Please connect your wallet to continue</p>
              </div>
            </div>
          </section>
        {:else if $store.userAddress && tokenName && tokenSymbol && !tokenNameError && !tokenSymbolError}
          <section class="section">
            <div class="container">
              <div class="box">
                <div class="columns">
                  <div class="column is-half factory-col has-text-centered">
                    <img
                      src="images/undraw_setup.svg"
                      alt="setup"
                      class="home-img" />
                  </div>
                  <div class="column is-half factory-col has-text-centered">
                    <p class="title is-5">Confirm your token information</p>
                    <br />
                    <div>
                      <p class="subtitle is-5">Name: {tokenName || 'none'}</p>
                      <p class="subtitle is-5">
                        Symbol: {tokenSymbol || 'none'}
                      </p>
                      <p class="subtitle is-5">Decimals: {tokenDecimals}</p>
                    </div>
                    <br />
                    <br />
                    <button
                      class="button is-success is-medium"
                      on:click={() => (openConfirmModal = true)}>
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        {/if}
      </div>
    </div>
  </div>
</div>
