<script>
  import { afterUpdate } from "svelte";
  import store from "../../store";
  import ChevronDown from "../../icons/ChevronDown.svelte";

  export let removedApproval;

  let approveError = false;
  let approving = false;
  let addressToApprove = "";
  let amountToApprove = "";
  let openApprovedAddresses = false;
  let checkedAllowances = false;

  $: if (!!removedApproval) {
    console.log("approval removed for:", removedApproval);
    checkAllowances();
  }

  const formatValue = event => {
    amountToApprove = parseInt(event.target.value);
    approveError = false;
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
      checkAllowances();
    } catch (error) {
      console.log(error);
      approving = false;
      approveError = true;
    }
  };

  afterUpdate(async () => {
    if ($store.tokenStorage && !checkedAllowances) {
      checkedAllowances = true;
      await checkAllowances();
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

  span.icon svg {
    width: 20px;
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
          {#if Object.keys($store.approvedAddresses).length > 0}
            <span>Approved addresses</span>
            <span class="icon">
              <ChevronDown width="20" />
            </span>
          {:else}
            <span>No approved address</span>
          {/if}
        </button>
      </div>
      <div class="dropdown-menu" id="approved-addresses" role="menu">
        <div class="dropdown-content">
          {#each Object.keys($store.approvedAddresses) as address}
            <p class="dropdown-item">
              {address.slice(0, 7) + '...' + address.slice(-7)} ({$store.approvedAddresses[address].toNumber()})
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
