<script>
  export let tokenSymbol, tokenStorage, userBalance;
</script>

<div class="columns is-centered">
  <div class="column is-two-fifths">
    <div class="box">
      <div class="columns">
        <div class="column is-half has-text-left">
          <p class="title is-6">Total Supply:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if tokenStorage}
            <p class="subtitle is-6">
              {tokenStorage.totalSupply.toNumber().toLocaleString('en-US')}
              {tokenSymbol}
            </p>
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns">
        <div class="column is-half has-text-left">
          <p class="title is-6">Account Balance:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if tokenStorage}
            {#if userBalance === undefined}
              Loading...
            {:else}
              <p class="subtitle is-6">
                {userBalance.toLocaleString('en-US')} {tokenSymbol}
              </p>
            {/if}
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns">
        <div class="column is-half has-text-left">
          <p class="title is-6">Supply Pool:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if tokenStorage}
            <p class="subtitle is-6">
              {tokenStorage.tokenBuyPool.toLocaleString('en-US')} {tokenSymbol}
            </p>
          {:else}Unavailable{/if}
        </div>
      </div>
    </div>
  </div>
  <div class="column is-two-fifths">
    <div class="box">
      <div class="columns">
        <div class="column is-half has-text-left">
          <p class="title is-6">Buy Price:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if tokenStorage}
            <p class="subtitle is-6">{tokenStorage.buyPrice} {tokenSymbol}</p>
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns">
        <div class="column is-half has-text-left">
          <p class="title is-6">Number of decimals:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if tokenStorage}
            <p class="subtitle is-6">{tokenStorage.metadata.decimals}</p>
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns">
        <div class="column is-half has-text-left">
          <p class="title is-6">Contract paused:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if tokenStorage}
            <p class="subtitle is-6">{tokenStorage.paused ? 'Yes' : 'No'}</p>
          {:else}Unavailable{/if}
        </div>
      </div>
    </div>
  </div>
</div>
