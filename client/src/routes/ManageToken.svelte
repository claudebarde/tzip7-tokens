<script>
  import { onMount, afterUpdate } from "svelte";
  import Navbar from "../components/Navbar/Navbar.svelte";
  import MintTokens from "../components/Manage/MintTokens.svelte";
  import SupplyPool from "../components/Manage/SupplyPool.svelte";
  import TokenInfo from "../components/Manage/TokenInfo.svelte";
  import store from "../store";

  export let params = {};

  let token = undefined;
  let tokenSymbol = undefined;
  let ownerBalance = undefined;
  let tokensSuggestions = [];
  let searchValue = "";
  let noSuggestion = false;
  let isAllowed = undefined;
  let isUnknown = false;

  const searchTokens = event => {
    const input = event.target.value.trim().toUpperCase();
    if (!input) {
      searchValue = "";
      tokensSuggestions = [];
    } else {
      const suggestions = $store.contractStorage.tokensList.filter(tk =>
        tk.includes(input)
      );
      if (suggestions.length > 0) {
        tokensSuggestions = [...suggestions];
      } else {
        noSuggestion = true;
        tokensSuggestions = [];
      }
      searchValue = input;
    }
  };

  onMount(() => {
    if (params.tokenSymbol) {
      tokenSymbol = params.tokenSymbol;
    }
  });

  afterUpdate(async () => {
    if (tokenSymbol && $store.contractStorage && !$store.tokenStorage) {
      // checks if current user has the right to manage the token
      try {
        const _token = await $store.contractStorage.tokens.get(tokenSymbol);
        if (!_token) throw "UnknownToken";

        if (_token.owner === $store.userAddress) {
          isAllowed = true;
        } else {
          isAllowed = false;
        }
        // creates token contract instance and saves important info
        token = _token;
        const tokenInstance = await $store.Tezos.contract.at(_token.address);
        store.updateTokenInstance(tokenInstance);
        const tokenStorage = await tokenInstance.storage();
        store.updateTokenStorage(tokenStorage);
        ownerBalance =
          (await tokenStorage.ledger.get(_token.owner)).balance.toNumber() || 0;
      } catch (error) {
        if (error === "UnknownToken") {
          isUnknown = true;
        }
      }
    }
  });
</script>

<div class="interface">
  <div class="interface__navbar">
    <Navbar />
  </div>
  <div class="interface__main">
    {#if !tokenSymbol}
      <section class="section">
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-half">
              <div class="box">
                <p class="title is-5">Find the token you want to manage:</p>
                <div
                  class="dropdown"
                  class:is-active={tokensSuggestions.length > 0}
                  style="width:100%">
                  <div class="dropdown-trigger" style="width:100%">
                    <input
                      type="text"
                      class="input is-medium"
                      class:is-danger={noSuggestion}
                      placeholder="Your token symbol"
                      on:input={searchTokens}
                      value={searchValue} />
                  </div>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <p class="dropdown-item">Token Symbols</p>
                      <hr class="dropdown-divider" />
                      {#each tokensSuggestions as token}
                        <a
                          href="/#"
                          class="dropdown-item"
                          on:click|preventDefault={() => {
                            history.replaceState({}, '', `#/manage/${token}`);
                            tokenSymbol = token;
                          }}>
                          {token}
                        </a>
                      {/each}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    {:else}
      <!-- if token exists-->
      {#if $store.userAddress === null}
        <div class="columns is-centered">
          <div class="column is-half">
            <section class="section">
              <div class="container">
                <article class="message is-danger">
                  <div class="message-body">
                    You must be connected to manage a token.
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      {:else if isAllowed}
        <section class="section">
          <div class="container">
            <p class="title is-3 has-text-centered">
              Manage your token - {tokenSymbol}
            </p>
            <TokenInfo
              {tokenSymbol}
              tokenStorage={$store.tokenStorage}
              userBalance={ownerBalance} />
            <div class="columns is-centered">
              <div class="column is-two-fifths">
                <MintTokens
                  on:updateUserBalance={event => {
                    ownerBalance += event.detail;
                  }} />
              </div>
              <div class="column is-two-fifths">
                <SupplyPool
                  on:updateUserBalance={event => {
                    ownerBalance -= event.detail;
                  }} />
              </div>
            </div>
          </div>
        </section>
      {:else}
        <!-- if user is allowed-->
        {#if !isAllowed && !isUnknown}
          <section class="section">
            <div class="container">
              {#if !$store.userAddress}
                Please log in to identify yourself
              {:else}You are not allowed to manage this token{/if}
            </div>
          </section>
        {:else if isUnknown}
          <section class="section">
            <div class="container">This token doesn't seem to exist</div>
          </section>
        {/if}
      {/if}
    {/if}
  </div>
</div>
