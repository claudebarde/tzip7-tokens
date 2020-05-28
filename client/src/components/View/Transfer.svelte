<script>
  import store from "../../store";

  let recipient = "";
  let amount = "";
  let transferError = false;
  let transferring = false;
  let errorMessage = "error";

  const formatValue = event => {
    amount = parseInt(event.target.value);
    transferError = false;
    if (amount > $store.userBalance) {
      transferError = true;
      errorMessage = "You don't have enough tokens in your balance";
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
          type: "transfer",
          txHash: op.hash,
          sender: $store.userAddress,
          recipient,
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
    <label for="transferTo">Which address do you want to send tokens to?</label>
    <input
      id="transferTo"
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
      class:is-danger={transferError}
      type="number"
      placeholder={`Amount of ${$store.tokenStorage.symbol} tokens`}
      on:input={formatValue}
      value={amount}
      disabled={transferring} />
    <p
      class={`is-size-7 has-text-right ${transferError ? 'has-text-danger' : 'has-text-white'}`}>
      {errorMessage}
    </p>
  </div>
  <div class="bottom-buttons">
    <button
      class="button is-info"
      class:is-loading={transferring}
      on:click={transfer}
      disabled={(!recipient && !amount) || transferError}>
      Transfer
    </button>
  </div>
</div>
