<script>
  import { afterUpdate } from "svelte";
  import store from "../../store";

  let tokens = [];

  afterUpdate(async () => {
    if (
      $store.contractStorage &&
      $store.contractStorage.tokensList &&
      tokens.length === 0
    ) {
      const tokensList = $store.contractStorage.tokensList.slice(0, 10);
      const tokensInfo = Promise.all(
        tokensList.map(
          async token => await $store.contractStorage.tokens.get(token)
        )
      );
      tokens = [...(await tokensInfo)];
    }
  });
</script>

<style>
  .main {
    height: 100%;
  }
</style>

<div class="box main">
  <div class="title is-5">Last created tokens</div>
  {#if $store.contractStorage && $store.contractStorage.tokensList}
    {#each tokens.slice(0, 10) as token}
      <div class="subtitle is-6" style="margin-top:20px;">
        <a href={`#/view/${token.symbol}`}>{token.symbol} ({token.name})</a>
      </div>
    {:else}
      <div class="subtitle is-6" style="margin-top:20px;">
        No token created yet!
      </div>
    {/each}
  {:else}
    <div class="subtitle is-6" style="margin-top:20px;">Loading...</div>
  {/if}
</div>
