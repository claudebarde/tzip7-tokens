<script>
  import { location } from "svelte-spa-router";
  import store from "../../store";
  import Switch from "../../icons/Switch.svelte";

  let pausing = false;

  const pause = async () => {
    pausing = true;
    try {
      const op = await $store.tokenInstance.methods.pause([["unit"]]).send();
      await op.confirmation();
      store.updateTokenStorage({
        ...$store.tokenStorage,
        ...(await $store.tokenInstance.storage())
      });
    } catch (error) {
      console.log(error);
    }
    pausing = false;
  };
</script>

<style>
  .switch-button {
    vertical-align: middle;
    cursor: pointer;
  }
</style>

<div class="columns is-centered">
  <div class="column is-two-fifths">
    <div class="box">
      <div class="columns is-mobile">
        <div class="column is-half has-text-left">
          <p class="title is-6">Total Supply:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if $store.tokenStorage}
            <p class="subtitle is-6">
              {store
                .formatWithDecimals(
                  'divide',
                  $store.tokenStorage.totalSupply.toNumber(),
                  $store.tokenStorage.metadata.decimals.toNumber()
                )
                .toLocaleString('en-US', {
                  minimumFractionDigits: $store.tokenStorage.metadata.decimals.toNumber(),
                  maximumFractionDigits: $store.tokenStorage.metadata.decimals.toNumber()
                })}
              {$store.tokenStorage.metadata.symbol}
            </p>
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-half has-text-left">
          <p class="title is-6">Your Balance:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if $store.tokenStorage}
            {#if $store.userBalance === undefined}
              Loading...
            {:else}
              <p class="subtitle is-6">
                {store
                  .formatWithDecimals(
                    'divide',
                    $store.userBalance,
                    $store.tokenStorage.metadata.decimals
                  )
                  .toLocaleString('en-US', {
                    minimumFractionDigits: $store.tokenStorage.metadata.decimals.toNumber(),
                    maximumFractionDigits: $store.tokenStorage.metadata.decimals.toNumber()
                  })}
                {$store.tokenStorage.metadata.symbol}
              </p>
            {/if}
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-half has-text-left">
          <p class="title is-6">Supply Pool:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if $store.tokenStorage}
            <p class="subtitle is-6">
              {store
                .formatWithDecimals(
                  'divide',
                  $store.tokenStorage.tokenBuyPool.toNumber(),
                  $store.tokenStorage.metadata.decimals
                )
                .toLocaleString('en-US', {
                  minimumFractionDigits: $store.tokenStorage.metadata.decimals,
                  maximumFractionDigits: $store.tokenStorage.metadata.decimals
                })}
              {$store.tokenStorage.metadata.symbol}
            </p>
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-half has-text-left">
          <p class="title is-6">Owner:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if $store.tokenStorage}
            <p class="subtitle is-6">
              <a
                href={`https://carthage.tzkt.io/${$store.tokenStorage.owner}/operations`}
                target="_blank"
                rel="noreferrer noopener">
                {$store.tokenStorage.owner.slice(0, 7) + '...' + $store.tokenStorage.owner.slice(-7)}
              </a>
            </p>
          {:else}Unavailable{/if}
        </div>
      </div>
    </div>
  </div>
  <div class="column is-two-fifths">
    <div class="box">
      <div class="columns is-mobile">
        <div class="column is-half has-text-left">
          <p class="title is-6">Buy Price:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if $store.tokenStorage}
            <p class="subtitle is-6">
              {$store.tokenStorage.buyPrice / 1000000} XTZ
            </p>
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-half has-text-left">
          <p class="title is-6">Number of decimals:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if $store.tokenStorage}
            <p class="subtitle is-6">{$store.tokenStorage.metadata.decimals}</p>
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-half has-text-left">
          <p class="title is-6">Token paused:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if $store.tokenStorage}
            <p class="subtitle is-6">
              {#if $location.includes('manage')}
                {#if $store.tokenStorage.paused}
                  {#if pausing}
                    <button class="button is-loading is-small">Loading</button>
                  {:else}
                    <span>Yes</span>
                    <span class="switch-button" on:click={pause}>
                      <Switch />
                    </span>
                  {/if}
                {:else if pausing}
                  <button class="button is-loading is-small">Loading</button>
                {:else}
                  <span>No</span>
                  <span class="switch-button" on:click={pause}>
                    <Switch />
                  </span>
                {/if}
              {:else if $store.tokenStorage.paused}
                <span>Yes</span>
              {:else}
                <span>No</span>
              {/if}
            </p>
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-half has-text-left">
          <p class="title is-6">Address:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if $store.tokenStorage}
            <p class="subtitle is-6">
              <a
                href={`https://you.better-call.dev/carthagenet/${$store.tokenStorage.address}/operations`}
                target="_blank"
                rel="noreferrer noopener">
                {$store.tokenStorage.address.slice(0, 7) + '...' + $store.tokenStorage.address.slice(-7)}
              </a>
            </p>
          {:else}Unavailable{/if}
        </div>
      </div>
    </div>
  </div>
</div>
