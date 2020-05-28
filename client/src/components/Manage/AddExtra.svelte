<script>
  import store from "../../store";

  let addExtraError = false;
  let errorMessage = "error";
  let key = "";
  let value = "";
  let addingExtra = false;

  const addExtra = async () => {
    addExtraError = false;
    // add extra info
    if (key && value) {
      addingExtra = true;
      try {
        const op = await $store.tokenInstance.methods
          .addExtra(key.toLowerCase(), value)
          .send();
        await op.confirmation();
        key = "";
        value = "";
        store.updateTokenStorage({
          ...$store.tokenStorage,
          ...(await $store.tokenInstance.storage())
        });
        addingExtra = false;
      } catch (error) {
        console.log(error);
        addExtraError = true;
        errorMessage = "An error has occured, please try again later.";
      }
    } else {
      addExtraError = true;
      errorMessage = "Invalid values";
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
  <p class="title is-6">Add Extra Information</p>
  <p>You can add extra information for your token.</p>
  <p>
    If you add a URL named "icon", it will be used as the official icon of your
    token.
  </p>
  <p>
    If you put your own name and use the name "owner", your name will be
    displayed instead of your address.
  </p>
  <br />
  <div>
    <label for="addExtraName">
      Which name do you want to give to this new information?
    </label>
    <input
      id="addExtraName"
      class="input"
      class:is-danger={addExtraError}
      type="text"
      placeholder="Icon or Owner or other"
      bind:value={key}
      disabled={addingExtra} />
    <br />
    <br />
    <label for="amountToApprove">
      Which information do you want to attach to the name?
    </label>
    <input
      id="amountToApprove"
      class="input"
      class:is-danger={addExtraError}
      type="text"
      placeholder="Extra information"
      bind:value
      disabled={addingExtra} />
    <p
      class={`is-size-7 has-text-right ${addExtraError ? 'has-text-danger' : 'has-text-white'}`}>
      {errorMessage}
    </p>
  </div>
  <div class="bottom-buttons">
    <button
      class="button is-info"
      class:is-loading={addingExtra}
      on:click={addExtra}
      disabled={addingExtra || addExtraError}>
      Add Information
    </button>
  </div>
</div>
