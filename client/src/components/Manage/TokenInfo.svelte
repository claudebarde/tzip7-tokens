<script>
  import store from "../../store";
</script>

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
              {$store.tokenStorage.totalSupply
                .toNumber()
                .toLocaleString('en-US')}
              {$store.tokenStorage.metadata.symbol}
            </p>
          {:else}Unavailable{/if}
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-half has-text-left">
          <p class="title is-6">Account Balance:</p>
        </div>
        <div class="column is-half has-text-right">
          {#if $store.tokenStorage}
            {#if $store.userBalance === undefined}
              Loading...
            {:else}
              <p class="subtitle is-6">
                {$store.userBalance.toLocaleString('en-US')}
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
              {$store.tokenStorage.tokenBuyPool
                .toNumber()
                .toLocaleString('en-US')}
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
              {$store.tokenStorage.paused ? 'Yes' : 'No'}
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
                href={`https://carthage.tzkt.io/${$store.tokenStorage.address}/operations`}
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
