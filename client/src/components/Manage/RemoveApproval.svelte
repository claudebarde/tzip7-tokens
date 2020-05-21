<script>
  import store from "../../store";

  let removeError = false;
  let removing = false;
  let address = "";

  const formatValue = event => {
    address = event.target.value;
    removeError = false;
  };

  const checkAllowances = async () => {
    let approvedAddresses = {};
    try {
      const account = await $store.tokenStorage.ledger.get($store.userAddress);
      if (account) {
        account.allowances.forEach(
          (value, key) => (approvedAddresses[key] = value)
        );
        store.updateApprovedAddresses(approvedAddresses);
      } else {
        throw "No account found";
      }
    } catch (error) {
      console.log(error);
      store.updateApprovedAddresses({});
    }
  };

  const removeApproval = async () => {
    removing = true;
    try {
      const op = await $store.tokenInstance.methods
        .removeApproval(address)
        .send();
      await op.confirmation();
      store.updateTokenStorage(await $store.tokenInstance.storage());
      checkAllowances();

      address = "";
      removing = false;
    } catch (error) {
      console.log(error);
      removing = false;
      removeError = true;
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
  <p class="title is-6">Remove Approval</p>
  <p>
    After approving an address for spending your tokens on your behalf, you can
    remove your approval.
  </p>
  <p>This address won't be able to spend your tokens anymore.</p>
  <br />
  <div>
    <label for="setPrice">Which address do you want to remove?</label>
    <input
      id="setPrice"
      class="input"
      class:is-danger={removeError}
      type="text"
      placeholder="Tezos Address"
      on:input={formatValue}
      value={address}
      disabled={removing} />
    {#if removeError}
      <p class="is-size-7 has-text-right has-text-danger">
        An error has occured, please try again.
      </p>
    {/if}
  </div>
  <div class="bottom-buttons">
    <button
      class="button is-warning"
      class:is-loading={removing}
      on:click={removeApproval}
      disabled={!address}>
      Remove Address
    </button>
  </div>
</div>
