<script>
  import store from "../../store";

  let tokensToBurn = "";
  let burning = false;
  let burningError = false;
  let errorMessage = "error";

  const formatValue = event => {
    tokensToBurn = parseInt(event.target.value);
    burningError = false;
    if (tokensToBurn > $store.userBalance) {
      burningError = true;
      errorMessage = "You don't have enough tokens in your balance";
    }
  };

  const burnTokens = async () => {
    burning = true;
    try {
      const op = await $store.tokenInstance.methods.burn(tokensToBurn).send();
      await op.confirmation();
      burning = false;
      store.updateUserBalance($store.userBalance - tokensToBurn);
      tokensToBurn = "";
      store.updateTokenStorage({
        ...$store.tokenStorage,
        ...(await $store.tokenInstance.storage())
      });
    } catch (error) {
      console.log(error);
      burningError = true;
      burning = false;
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
  <p class="title is-6">Burn tokens</p>
  <p>
    Burning tokens allows you to remove part of the tokens you own to decrease
    the total supply.
  </p>
  <p>
    Burned tokens will be taken out of your account and will not be available
    for purchase or transfer.
  </p>
  <br />
  <div>
    <label for="tokensToBurn">How many tokens do you want to burn?</label>
    <input
      id="tokensToBurn"
      class="input"
      class:is-danger={burningError}
      type="number"
      placeholder={`Maximum amount of tokens to burn: ${$store.userBalance > 0 ? $store.userBalance.toLocaleString('en-US') : '--'}`}
      on:input={formatValue}
      value={tokensToBurn}
      disabled={burning} />
    <p
      class={`is-size-7 has-text-right ${burningError ? 'has-text-danger' : 'has-text-white'}`}>
      {errorMessage}
    </p>
  </div>
  <div class="bottom-buttons">
    <button
      class="button is-danger"
      class:is-loading={burning}
      on:click={burnTokens}
      disabled={!tokensToBurn || burningError}>
      Burn tokens
    </button>
  </div>
</div>
