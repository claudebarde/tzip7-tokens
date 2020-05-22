<script>
  import store from "../../store";

  let recipient = "";
  let amount = "";
  let notEnoughFunds = false;
  let transferError = false;
  let transferring = false;

  const formatValue = event => {
    amount = parseInt(event.target.value);
    transferError = false;
    if (amount > $store.userBalance) {
      notEnoughFunds = true;
    } else {
      notEnoughFunds = false;
    }
  };

  const transfer = async () => {
    // transfer tokens
    transferError = false;
    transferring = true;
    try {
      const op = await $store.tokenInstance.methods
        .transfer($store.userAddress, recipient, amount)
        .send();
      await op.confirmation();
      if (window.localStorage) {
        const txHistoryItem = `${$store.tokenStorage.metadata.symbol}txsHistory`;
        // saves transaction in local storage
        const newTx = {
          txHash: op.hash,
          recipient,
          amount,
          token: $store.tokenStorage.symbol,
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
      recipient = "";
      amount = "";
      transferring = false;
    } catch (error) {
      console.log(error);
      transferError = true;
      transferring = false;
    }
  };
</script>

<style>
  .bottom-buttons {
    padding-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .box {
    height: 100%;
  }
</style>

<div class="box">
  <p class="title is-6">Transfer tokens</p>
  <p>
    You can transfer tokens from your account to another account by using its
    Tezos address.
  </p>
  <br />
  <div>
    <label for="addressToApprove">
      Which address do you want to send tokens to?
    </label>
    <input
      id="addressToApprove"
      class="input"
      class:is-danger={transferError}
      type="text"
      placeholder="Valid address"
      bind:value={recipient}
      disabled={transferring} />
    <br />
    <br />
    <label for="amountToApprove">Which amount do you want to send?</label>
    <input
      id="amountToApprove"
      class="input"
      class:is-danger={transferError || notEnoughFunds}
      type="number"
      placeholder={`Amount of ${$store.tokenStorage.symbol} tokens`}
      on:input={formatValue}
      value={amount}
      disabled={transferring} />
    {#if transferError}
      <p class="is-size-7 has-text-right has-text-danger">
        An error has occured, please try again.
      </p>
    {/if}
  </div>
  <div class="bottom-buttons">
    <button
      class="button is-info"
      class:is-loading={transferring}
      on:click={transfer}
      disabled={!recipient && !amount}>
      Transfer
    </button>
  </div>
</div>
