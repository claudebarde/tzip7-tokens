<script>
  import { afterUpdate } from "svelte";
  import store from "../../store";

  let approveError = false;
  let approving = false;
  let addressToApprove = "";
  let amountToApprove = "";
  let openApprovedAddresses = false;
  let approvedAddresses = {};

  const formatValue = event => {
    amountToApprove = parseInt(event.target.value);
    approveError = false;
  };

  const approve = async () => {
    approving = true;
    try {
      const op = await $store.tokenInstance.methods
        .approve(addressToApprove, amountToApprove)
        .send();
      await op.confirmation();
      approving = false;
      addressToApprove = "";
      amountToApprove = "";
      store.updateTokenStorage(await $store.tokenInstance.storage());
    } catch (error) {
      console.log(error);
      approving = false;
      approveError = true;
    }
  };

  afterUpdate(async () => {
    if ($store.tokenStorage) {
      const account = await $store.tokenStorage.ledger.get($store.userAddress);
      account.allowances.forEach(
        (value, key) => (approvedAddresses[key] = value)
      );
    }
  });
</script>

<style>
  .bottom-buttons {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
  }

  .box {
    height: 100%;
  }
</style>

<div class="box">
  <p class="title is-6">Approve third-party account</p>
  <p>
    You can approve a third-party address to spend a certain amount of your
    tokens on your behalf.
  </p>
  <br />
  <div>
    <label for="addressToApprove">Which address do you want to allow?</label>
    <input
      id="addressToApprove"
      class="input"
      class:is-danger={approveError}
      type="text"
      placeholder="Valid address"
      bind:value={addressToApprove}
      disabled={approving} />
    <br />
    <br />
    <label for="amountToApprove">Which amount do you want to allow?</label>
    <input
      id="amountToApprove"
      class="input"
      class:is-danger={approveError}
      type="number"
      placeholder="Price in XTZ"
      on:input={formatValue}
      value={amountToApprove}
      disabled={approving} />
    {#if approveError}
      <p class="is-size-7 has-text-right has-text-danger">
        An error has occured, please try again.
      </p>
    {/if}
  </div>
  <div class="bottom-buttons">
    <div class="dropdown" class:is-active={openApprovedAddresses}>
      <div class="dropdown-trigger">
        <button
          class="button"
          aria-haspopup="true"
          aria-controls="approved-addresses"
          on:click={() => (openApprovedAddresses = !openApprovedAddresses)}>
          <span>Approved addresses</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="approved-addresses" role="menu">
        <div class="dropdown-content">
          {#each Object.keys(approvedAddresses) as address}
            <p class="dropdown-item">
              {address.slice(0, 7) + '...' + address.slice(-7)} ({approvedAddresses[address].toNumber()})
            </p>
          {/each}
        </div>
      </div>
    </div>
    <button
      class="button is-info"
      class:is-loading={approving}
      on:click={approve}
      disabled={!addressToApprove || !amountToApprove}>
      Approve
    </button>
  </div>
</div>
