<script>
  import { onMount, afterUpdate } from "svelte";
  import Navbar from "../components/Navbar/Navbar.svelte";
  import TokenInfo from "../components/Manage/TokenInfo.svelte";
  import Approve from "../components/Manage/Approve.svelte";
  import RemoveApproval from "../components/Manage/RemoveApproval.svelte";
  import Transfer from "../components/View/Transfer.svelte";
  import TransactionsHistory from "../components/View/TransactionsHistory.svelte";
  import store from "../store";

  export let params;

  let token = undefined;
  let tokenNotFound = false;

  onMount(() => {
    if (
      params.tokenSymbol &&
      $store.tokenStorage &&
      params.tokenSymbol !== $store.tokenStorage.symbol
    ) {
      // resets storage if queried token is not the same as the one on storage
      store.updateTokenStorage(undefined);
      store.updateTokenInstance(undefined);
    }
  });

  afterUpdate(async () => {
    if ($store.userAddress && $store.tokenStorage && $store.userBalance === 0) {
      // updates user's balance if user wasn't connected
      const account = await $store.tokenStorage.ledger.get($store.userAddress);
      if (account) {
        // user's balance
        store.updateUserBalance(account.balance.toNumber());
        // user's allowed spenders
        const approvedAddresses = {};
        account.allowances.forEach(
          (value, key) => (approvedAddresses[key] = value)
        );
        store.updateApprovedAddresses(approvedAddresses);
      }
    }

    if (
      params.tokenSymbol &&
      $store.contractStorage &&
      !token &&
      !tokenNotFound
    ) {
      try {
        // gets token contract address
        const _token = await $store.contractStorage.tokens.get(
          params.tokenSymbol
        );
        if (_token) {
          token = _token;
          const tokenInstance = await $store.Tezos.contract.at(_token.address);
          const tokenStorage = await tokenInstance.storage();
          // updates store
          store.updateTokenInstance(tokenInstance);
          store.updateTokenStorage({ ...tokenStorage, ..._token });
          // gets user's balance
          if ($store.userAddress) {
            const account = await tokenStorage.ledger.get($store.userAddress);
            if (account) {
              // user's balance
              store.updateUserBalance(account.balance.toNumber());
              // user's allowed spenders
              const approvedAddresses = {};
              account.allowances.forEach(
                (value, key) => (approvedAddresses[key] = value)
              );
              store.updateApprovedAddresses(approvedAddresses);
            } else {
              store.updateUserBalance(0);
              store.updateApprovedAddresses({});
            }
          }
        } else {
          throw "No token found";
        }
      } catch (error) {
        console.log(error);
        tokenNotFound = true;
      }
    }

    if ($store.tokenStorage && window.localStorage) {
      // retrieves transaction history for token in localStorage
      const txsHistory = window.localStorage.getItem(
        `${$store.tokenStorage.metadata.symbol}txsHistory`
      );
      if (txsHistory) {
        store.updateTransactionsHistory(JSON.parse(txsHistory));
      }
    }
  });
</script>

<div class="interface">
  <div class="interface__navbar">
    <Navbar />
  </div>
  <div class="interface__main">
    <section class="section">
      <div class="container">
        {#if tokenNotFound}
          <div class="message is-danger">
            <div class="message-body">
              <strong>Token Not Found</strong>
              <p>
                There is no existing token with this symbol ({params.tokenSymbol}).
              </p>
            </div>
          </div>
        {:else if token}
          <p class="title is-3 has-text-centered is-hidden-mobile">
            {token.name} ({token.symbol}) Token Interface
          </p>
          <p class="title is-3 has-text-centered is-hidden-desktop">
            {token.name} ({token.symbol})
            <br />
            Token Interface
          </p>
          <TokenInfo />
        {/if}
        {#if $store.userAddress}
          {#if $store.tokenStorage}
            <div class="columns is-centered">
              <div class="column is-two-fifths">
                <Transfer />
              </div>
              <div class="column is-two-fifths">
                <Approve />
              </div>
            </div>
            <div class="columns is-centered">
              <div class="column is-two-fifths">Buy tokens</div>
              <div class="column is-two-fifths">
                <RemoveApproval />
              </div>
            </div>
            <div class="columns is-centered">
              <div class="column is-four-fifths">
                <TransactionsHistory />
              </div>
            </div>
          {/if}
        {:else}
          <div class="columns is-centered">
            <div class="column is-four-fifths">
              <div class="message is-info">
                <div class="message-body">
                  Please connect your wallet to use this token.
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </section>
  </div>
</div>
