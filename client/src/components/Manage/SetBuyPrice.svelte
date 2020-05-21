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
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .box {
    height: 100%;
    position: relative;
  }

  .bottom-div {
    position: absolute;
    bottom: 1.25rem;
    right: 1.25rem;
    width: 90%;
  }

  @media only screen and (max-width: 1024px) {
    .bottom-div {
      position: initial;
      width: 100%;
    }
  }
</style>

<div class="box">
  <p class="title is-6">Set Buy Price</p>
  <p>
    You can set a new price for your tokens that the other users will pay in
    order to acquire more of your tokens.
  </p>
  <br />
  <p>
    The tokens in the supply pool will be available for purchase at the price
    you will set.
  </p>
  <br />
  <div class="bottom-div">
    <div class="field">
      <label for="setPrice">Which price do you want to set?</label>
      <p class="control has-icons-left">
        <input
          id="setPrice"
          class="input"
          class:is-danger={priceError}
          type="number"
          placeholder="Price in XTZ"
          on:input={formatValue}
          value={price}
          disabled={settingPrice} />
        <span class="icon is-small is-left">ꜩ</span>
      </p>
    </div>
    {#if priceError}
      <p class="is-size-7 has-text-right has-text-danger">
        An error has occured, please try again.
      </p>
    {/if}
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
</div>
