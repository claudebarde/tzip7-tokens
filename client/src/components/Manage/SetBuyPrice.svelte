<script>
  import store from "../../store";

  let priceError = false;
  let settingPrice = false;
  let price = "";

  const formatValue = event => {
    price = event.target.value;
    priceError = false;
  };

  const setPrice = async () => {
    settingPrice = true;
    try {
      const op = await $store.tokenInstance.methods
        .setBuyPrice(price * 1000000)
        .send({ mutez: true });
      await op.confirmation();
      settingPrice = false;
      price = "";
      store.updateTokenStorage(await $store.tokenInstance.storage());
    } catch (error) {
      console.log(error);
      settingPrice = false;
      priceError = true;
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
  <p class="title is-6">Set Buy Price</p>
  <p>
    You can set a new price for your tokens that the other users will pay in
    order to acquire more of your tokens.
  </p>
  <br />
  <div>
    <label for="setPrice">Which price do you want to set?</label>
    <input
      id="setPrice"
      class="input"
      class:is-danger={priceError}
      type="number"
      placeholder="Price in XTZ"
      on:input={formatValue}
      value={price}
      disabled={settingPrice} />
    {#if priceError}
      <p class="is-size-7 has-text-right has-text-danger">
        An error has occured, please try again.
      </p>
    {/if}
  </div>
  <div class="bottom-buttons">
    <button
      class="button is-info"
      class:is-loading={settingPrice}
      on:click={setPrice}
      disabled={!price}>
      Set Price
    </button>
  </div>
</div>
