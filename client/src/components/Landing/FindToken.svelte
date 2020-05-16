<script>
  import { push } from "svelte-spa-router";
  import store from "../../store.js";

  let tokensSuggestions = [];
  let searchValue = "";
  let noSuggestion = false;

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
</script>

<style>
  .main {
    height: 100%;
  }

  .input-img {
    opacity: 0.4;
  }
</style>

<div class="box main">
  <div class="title is-5">Find tokens</div>
  <div
    class="dropdown"
    class:is-active={tokensSuggestions.length > 0}
    style="width:100%">
    <div class="dropdown-trigger" style="width:100%">
      <div class="control has-icons-left has-icons-right">
        <input
          type="text"
          class="input is-medium"
          class:is-danger={noSuggestion}
          placeholder="Your token symbol"
          on:input={searchTokens}
          value={searchValue} />
        <span class="icon is-medium is-left">
          <img src="images/coins.png" alt="coins" class="input-img" />
        </span>
      </div>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <p class="dropdown-item">Token Symbols</p>
        <hr class="dropdown-divider" />
        {#each tokensSuggestions as token}
          <a
            href={`#/view/${token}`}
            class="dropdown-item"
            on:click|preventDefault={() => push(`#/view/${token}`)}>
            {token}
          </a>
        {/each}
      </div>
    </div>
  </div>
</div>
