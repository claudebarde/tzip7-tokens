<script>
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar/Navbar.svelte";
  import store from "../store";

  export let params = {};

  let tokenSymbol = undefined;
  let tokensSuggestions = [];
  let searchValue = "";
  let noSuggestion = false;
  let isAllowed = undefined;

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

  $: if (tokenSymbol && $store.contractStorage) {
    // checks if current user has the right to manage the token
    (async () => {
      try {
        const _token = await $store.contractStorage.tokens.get(tokenSymbol);
        if (_token.owner === $store.userAddress) {
          isAllowed = true;
        } else {
          isAllowed = false;
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }

  onMount(() => {
    if (params.tokenSymbol) {
      tokenSymbol = params.tokenSymbol;
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
    {:else if $store.userAddress === null}
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
        <div class="container">Manage your token</div>
      </section>
    {:else}
      <section class="section">
        <div class="container">You are not allowed to manage this token</div>
      </section>
    {/if}
  </div>
</div>
