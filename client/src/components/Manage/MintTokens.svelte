<script>
  import store from "../../store";

  let tokensToMint = "";
  let minting = false;
  let mintingError = false;

  const formatValue = event => {
    tokensToMint = parseInt(event.target.value);
    mintingError = false;
  };

  const mintTokens = async () => {
    minting = true;
    try {
      const op = await $store.tokenInstance.methods.mint(tokensToMint).send();
      await op.confirmation();
      minting = false;
      store.updateUserBalance($store.userBalance + tokensToMint);
      tokensToMint = "";
      store.updateTokenStorage({
        ...$store.tokenStorage,
        ...(await $store.tokenInstance.storage())
      });
    } catch (error) {
      console.log(error);
      mintingError = true;
      minting = false;
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
  <p class="title is-6">Mint tokens</p>
  <p>
    Minting tokens allows you to create new tokens that can be sold, transferred
    or burned.
  </p>
  <p>
    Minted tokens will be added to your own address, but you can transfer them
    to the supply pool to make them available for purchase by other users.
  </p>
  <br />
  <div>
    <label for="tokensToMint">How many tokens do you want to mint?</label>
    <input
      id="tokensToMint"
      class="input"
      class:is-danger={mintingError}
      type="number"
      placeholder="Amount of tokens to mint"
      on:input={formatValue}
      value={tokensToMint}
      disabled={minting} />
    <p
      class={`is-size-7 has-text-right ${mintingError ? 'has-text-danger' : 'has-text-white'}`}>
      An error has occured, please try again.
    </p>
  </div>
  <div class="bottom-buttons">
    <button
      class="button is-success"
      class:is-loading={minting}
      on:click={mintTokens}
      disabled={!tokensToMint}>
      Mint tokens
    </button>
  </div>
</div>
