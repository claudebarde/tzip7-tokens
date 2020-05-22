<script>
  import { createEventDispatcher } from "svelte";
  import store from "../../store";

  const dispatch = createEventDispatcher();

  export let userBalance;

  let tokensToBurn = "";
  let burning = false;
  let burningError = false;

  const formatValue = event => {
    tokensToBurn = parseInt(event.target.value);
    burningError = false;
  };

  const burnTokens = async () => {
    burning = true;
    try {
      const op = await $store.tokenInstance.methods.burn(tokensToBurn).send();
      await op.confirmation();
      burning = false;
      dispatch("updateUserBalance", tokensToBurn);
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
      placeholder={`Maximum amount of tokens to burn: ${userBalance}`}
      on:input={formatValue}
      value={tokensToBurn}
      disabled={burning} />
    {#if burningError}
      <p class="is-size-7 has-text-right has-text-danger">
        An error has occured, please try again.
      </p>
    {/if}
  </div>
  <div class="bottom-buttons">
    <button
      class="button is-danger"
      class:is-loading={burning}
      on:click={burnTokens}
      disabled={!tokensToBurn}>
      Burn tokens
    </button>
  </div>
</div>
