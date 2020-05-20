<script>
  import { createEventDispatcher } from "svelte";
  import store from "../../store";

  const dispatch = createEventDispatcher();

  let supplyError = false;
  let tokensToSupply = "";
  let supplying = false;

  const formatValue = event => {
    tokensToSupply = parseInt(event.target.value);
    supplyError = false;
  };

  const supplyPool = async () => {
    supplying = true;
    try {
      const op = await $store.tokenInstance.methods
        .supplyBuyPool(tokensToSupply)
        .send();
      await op.confirmation();
      supplying = false;
      dispatch("updateUserBalance", tokensToSupply);
      tokensToSupply = "";
      store.updateTokenStorage(await $store.tokenInstance.storage());
    } catch (error) {
      console.log(error);
      supplyError = true;
      supplying = false;
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
      placeholder="Amount of tokens to mint"
      on:input={formatValue}
      value={tokensToSupply}
      disabled={supplying} />
    {#if supplyError}
      <p class="is-size-7 has-text-right has-text-danger">
        An error has occured, please try again.
      </p>
    {/if}
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
