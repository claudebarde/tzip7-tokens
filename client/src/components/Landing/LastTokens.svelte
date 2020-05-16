<script>
  import store from "../../store";
</script>

<style>
  .main {
    height: 100%;
  }
</style>

<div class="box main">
  <div class="title is-5">Last created tokens</div>
  {#if $store.contractStorage}
    {#each $store.contractStorage.tokensList.slice(0, 10) as token}
      {token.name}
    {:else}
      <div class="subtitle is-5" style="margin-top:20px;">
        No token created yet!
      </div>
    {/each}
  {:else}
    <div class="subtitle is-5" style="margin-top:20px;">Loading...</div>
  {/if}
</div>
