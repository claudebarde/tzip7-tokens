<script>
  import { afterUpdate } from "svelte";
  import store from "../../store";

  let tokenChunks = [];

  afterUpdate(async () => {
    if (
      $store.contractStorage &&
      $store.contractStorage.tokensList &&
      $store.contractStorage.tokensList.length > 0 &&
      tokenChunks.length === 0
    ) {
      const tokensList = $store.contractStorage.tokensList.slice(0, 10);
      const tokensInfo = Promise.all(
        tokensList.map(
          async token => await $store.contractStorage.tokens.get(token)
        )
      );
      const _tokens = [...(await tokensInfo)];
      tokenChunks = Array(Math.ceil(_tokens.length / 3))
        .fill()
        .map((_, index) => index * 3)
        .map(begin => _tokens.slice(begin, begin + 3));
    }
  });
</script>

<style>
  .main {
    height: 100%;
  }
</style>

<div class="box main">
  <div class="title is-5 is-marginless">Last created tokens</div>
  {#if $store.contractStorage && $store.contractStorage.tokensList}
    <div class="columns">
      {#each tokenChunks as tokens}
        <div class="column is-one-third">
          {#each tokens as token}
            <div style="margin-top:10px;">
              <a href={`#/view/${token.symbol}`}>
                {token.symbol} ({token.name})
              </a>
            </div>
          {/each}
        </div>
      {:else}
        <div class="column is-one-third">
          <div class="subtitle is-6" style="margin-top:20px;">
            No token created yet!
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="subtitle is-6" style="margin-top:20px;">Loading...</div>
  {/if}
</div>
