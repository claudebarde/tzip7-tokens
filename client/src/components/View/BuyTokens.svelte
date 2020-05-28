<script>
  import store from "../../store";

  let amount = "";
  let price = undefined;
  let buyError = false;
  let buying = false;
  let errorMessage = "error";

  const formatValue = event => {
    let value = event.target.value.trim();
    buyError = false;
    if (value) {
      amount = parseInt(value);
      price =
        (amount *
          store.formatWithDecimals(
            "multiply",
            $store.tokenStorage.buyPrice,
            $store.tokenStorage.metadata.decimals
          )) /
        1000000;
      buyError =
        amount >
        store.formatWithDecimals(
          "divide",
          $store.tokenStorage.tokenBuyPool.toNumber(),
          $store.tokenStorage.metadata.decimals
        );
      errorMessage = "There are not enough tokens available in the pool";
    } else {
      amount = "";
    }
  };

  const buy = async () => {
    // buy tokens
    buyError = false;
    buying = true;
    // adjusts number of tokens taking the decimals into account
    const amountWithDecimals = store.formatWithDecimals(
      "multiply",
      amount,
      $store.tokenStorage.metadata.decimals.toNumber()
    );
    try {
      const op = await $store.tokenInstance.methods
        .buy(amountWithDecimals)
        .send({ amount: price * 1000000, mutez: true });
      await op.confirmation();
      if (window.localStorage) {
        const txHistoryItem = `${$store.tokenStorage.metadata.symbol}txsHistory`;
        // saves transaction in local storage
        const newTx = {
          type: "buy",
          txHash: op.hash,
          sender: $store.userAddress,
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
      store.updateUserBalance($store.userBalance + amountWithDecimals);
      // gets new storage
      store.updateTokenStorage({
        ...$store.tokenStorage,
        ...(await $store.tokenInstance.storage())
      });
      amount = "";
      buying = false;
      price = undefined;
    } catch (error) {
      console.log(error);
      buyError = true;
      if (error.message) errorMessage = error.message;

      buying = false;
      price = undefined;
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
      class:is-danger={buyError}
      type="number"
      placeholder={`Amount of ${$store.tokenStorage.symbol} tokens`}
      on:input={formatValue}
      value={amount}
      disabled={buying} />
    <p
      class={`is-size-7 has-text-right ${buyError ? 'has-text-danger' : 'has-text-white'}`}>
      {errorMessage}
    </p>
  </div>
  <div class="bottom-buttons">
    <button class="button is-static">
      {#if buyError}
        Error
      {:else}{amount || 0} token{amount > 1 ? 's' : ''} for ꜩ {price || 0}{/if}
    </button>
    <button
      class="button is-success"
      class:is-loading={buying}
      on:click={buy}
      disabled={!amount || buyError}>
      Buy
    </button>
  </div>
</div>
