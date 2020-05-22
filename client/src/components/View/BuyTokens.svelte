<script>
  import store from "../../store";

  let amount = "";
  let buyError = false;
  let buying = false;
  let exceedSupplyPool = false;

  const formatValue = event => {
    let value = event.target.value.trim();
    if (value) {
      amount = parseInt(value);
      exceedSupplyPool = amount > $store.tokenStorage.tokenBuyPool.toNumber();
    } else {
      amount = "";
    }
    buyError = false;
  };

  const transfer = async () => {
    // transfer tokens
    buyError = false;
    buying = true;
    try {
      const op = await $store.tokenInstance.methods
        .buy(amount)
        .send({ amount: amount * $store.tokenStorage.buyPrice, mutez: true });
      await op.confirmation();
      if (window.localStorage) {
        const txHistoryItem = `${$store.tokenStorage.metadata.symbol}txsHistory`;
        // saves transaction in local storage
        const newTx = {
          type: "buy",
          txHash: op.hash,
          amount,
          timestamp: Date.now()
        };
        if ($store.transactionsHistory.length > 0) {
          const txs = [newTx, ...$store.transactionsHistory];
          window.localStorage.setItem(txHistoryItem, JSON.stringify(txs));
          store.updateTransactionsHistory(txs);
        } else {
          window.localStorage.setItem(txHistoryItem, JSON.stringify([newTx]));
          store.updateTransactionsHistory([newTx]);
        }
      }
      // updates user's balance
      store.updateUserBalance($store.userBalance - amount);
      // gets new storage
      store.updateContractStorage({
        ...$store.contractStorage,
        ...(await $store.tokenInstance.storage())
      });
      amount = "";
      buying = false;
    } catch (error) {
      console.log(error);
      buyError = true;
      buying = false;
    }
  };
</script>

<style>
  .bottom-buttons {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
  }

  .box {
    height: 100%;
  }
</style>

<div class="box">
  <p class="title is-6">Buy tokens</p>
  <p>Tokens in the supply pool are available for purchase.</p>
  <p>
    The amount in XTZ to be paid for the purchase will be automatically
    calculated according to the current buy price.
  </p>
  <br />
  <div>
    <label for="buyTokens">How many tokens do you want to buy?</label>
    <input
      id="buyTokens"
      class="input"
      class:is-danger={buyError || exceedSupplyPool}
      type="number"
      placeholder={`Amount of ${$store.tokenStorage.symbol} tokens`}
      on:input={formatValue}
      value={amount}
      disabled={buying} />
    {#if buyError}
      <p class="is-size-7 has-text-right has-text-danger">
        An error has occured, please try again.
      </p>
    {/if}
  </div>
  <div class="bottom-buttons">
    <button class="button is-static">
      {#if exceedSupplyPool}
        Not Enough Tokens
      {:else}
        {amount || 0} token{amount > 1 ? 's' : ''} for ꜩ {(amount * $store.tokenStorage.buyPrice) / 1000000}
      {/if}
    </button>
    <button
      class="button is-success"
      class:is-loading={buying}
      on:click={transfer}
      disabled={!amount || exceedSupplyPool}>
      Buy
    </button>
  </div>
</div>
