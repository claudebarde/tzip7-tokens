<script>
  import store from "../../store";

  let supplyError = false;
  let tokensToSupply = "";
  let supplying = false;
  let errorMessage = "error";

  const formatValue = event => {
    tokensToSupply = parseInt(event.target.value);
    supplyError = false;
    if (tokensToSupply > $store.userBalance) {
      supplyError = true;
      errorMessage = "You don't have enough tokens in your balance";
    }
  };

  const supplyPool = async () => {
    supplying = true;
    try {
      const op = await $store.tokenInstance.methods
        .supplyBuyPool(tokensToSupply)
        .send();
      await op.confirmation();
      supplying = false;
      store.updateUserBalance($store.userBalance - tokensToSupply);
      tokensToSupply = "";
      store.updateTokenStorage({
        ...$store.tokenStorage,
        ...(await $store.tokenInstance.storage())
      });
    } catch (error) {
      console.log(error);
      supplyError = true;
      supplying = false;
      errorMessage = "An error has occured, please try again";
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
  <p class="title is-6">Supply Purchase Pool</p>
  <p>
    The "supply pool" is the amount of tokens you make available for purchase.
  </p>
  <p>
    These tokens will be debited from your account and you won't have access to
    them anymore.
  </p>
  <p>The other users can buy tokens in the supply pool.</p>
  <br />
  <div>
    <label for="tokensToSupply">
      How many tokens do you want to make available?
    </label>
    <input
      id="tokensToSupply"
      class="input"
      class:is-danger={supplyError}
      type="number"
      placeholder={`Available tokens: ${$store.userBalance > 0 ? $store.userBalance.toLocaleString('en-US') : '--'}`}
      on:input={formatValue}
      value={tokensToSupply}
      disabled={supplying} />
    <p
      class={`is-size-7 has-text-right ${supplyError ? 'has-text-danger' : 'has-text-white'}`}>
      {errorMessage}
    </p>
  </div>
  <div class="bottom-buttons">
    <button
      class="button is-success"
      class:is-loading={supplying}
      on:click={supplyPool}
      disabled={!tokensToSupply}>
      Supply Pool
    </button>
  </div>
</div>
