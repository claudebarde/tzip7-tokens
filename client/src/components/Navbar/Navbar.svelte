<script>
  import { onMount } from "svelte";
  import { location, push } from "svelte-spa-router";
  import Home from "../../icons/Home.svelte";
  import Manage from "../../icons/Manage.svelte";
  import Create from "../../icons/Create.svelte";
  import Find from "../../icons/Find.svelte";
  import XCircle from "../../icons/XCircle.svelte";
  import User from "../../icons/User.svelte";
  import Coins from "../../icons/Coins.svelte";
  import store from "../../store.js";

  let walletIconHover = false;
  let homeIconHover = false;
  let createIconHover = false;
  let manageIconHover = false;
  let coinIconHover = false;
  let findIconHover = false;
  let tezbridgeSigner = undefined;

  const initWallet = async () => {
    const address = await window.tezbridge.request({ method: "get_source" });
    store.updateUserAddress(address);
    if (window.localStorage) {
      window.localStorage.setItem("lastConnection", Date.now());
    }
  };

  onMount(async () => {
    if (window.localStorage) {
      const lastConnection = window.localStorage.getItem("lastConnection");
      // if last connection happened in the last 3 days
      if (
        lastConnection &&
        Date.now() - lastConnection < 60 * 60 * 24 * 3 * 1000
      ) {
        try {
          const address = await window.tezbridge.request({
            method: "get_source"
          });
          store.updateUserAddress(address);
        } catch (error) {
          console.log(error);
          store.updateUserAddress(null);
        }
      }
    }
  });
</script>

<style>
  .navigation {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-right: solid 1px grey;
    padding: 70px 0px;
    position: fixed;
    z-index: 100;
  }

  .navigation-element {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px 0px;
    cursor: pointer;
    padding: 6px;
    width: 100%;
    border: solid 1px #4a4a4a;
  }

  .navigation-element:hover {
    border: solid 1px #a3a3a3;
    background-color: #a3a3a3;
  }

  .navigation-icon {
    width: 32px;
    height: 32px;
  }

  @media only screen and (max-width: 1024px) {
    .navigation {
      flex-direction: row;
      padding: 10px 5px;
      height: 60px;
      width: 100%;
    }

    .navigation-element {
      padding: 4px;
    }

    .navigation-icon {
      width: 24px;
      height: 24px;
    }
  }
</style>

<div class="navigation has-text-centered has-background-grey-dark">
  <div
    class="navigation-element"
    on:click={() => push('/')}
    on:mouseenter={() => (homeIconHover = true)}
    on:mouseleave={() => (homeIconHover = false)}>
    <div class="image navigation-icon">
      <Home
        color={$location === '/' ? 'white' : homeIconHover ? '#333' : '#B5B5B5'} />
    </div>
    <span
      class={$location === '/' ? 'has-text-white' : homeIconHover ? 'has-text-black' : 'has-text-grey-light'}>
      Home
    </span>
  </div>
  <div
    class="navigation-element"
    on:click={() => push('/create')}
    on:mouseenter={() => (createIconHover = true)}
    on:mouseleave={() => (createIconHover = false)}>
    <div class="image navigation-icon">
      <Create
        color={$location === '/create' ? 'white' : createIconHover ? '#333' : '#B5B5B5'} />
    </div>
    <span
      class={$location === '/create' ? 'has-text-white' : createIconHover ? 'has-text-black' : 'has-text-grey-light'}>
      Create
    </span>
  </div>
  <div
    class="navigation-element"
    on:click={() => push('/manage')}
    on:mouseenter={() => (manageIconHover = true)}
    on:mouseleave={() => (manageIconHover = false)}>
    <div class="image navigation-icon">
      <Manage
        color={$location.includes('/manage') ? 'white' : manageIconHover ? '#333' : '#B5B5B5'} />
    </div>
    <span
      class={$location.includes('/manage') ? 'has-text-white' : manageIconHover ? 'has-text-black' : 'has-text-grey-light'}>
      Manage
    </span>
  </div>
  {#if $store.tokenStorage}
    <div
      class="navigation-element"
      on:click={() => push(`/view/${$store.tokenStorage.symbol}`)}
      on:mouseenter={() => (coinIconHover = true)}
      on:mouseleave={() => (coinIconHover = false)}>
      <div class="image navigation-icon">
        <Coins
          color={$location.includes('/view') ? 'white' : coinIconHover ? '#333' : '#B5B5B5'} />
      </div>
      <span
        class={$location.includes('/view') ? 'has-text-white' : coinIconHover ? 'has-text-black' : 'has-text-grey-light'}>
        {$store.tokenStorage.symbol}
      </span>
    </div>
  {/if}
  <br />
  <div
    class="navigation-element"
    on:click={initWallet}
    on:mouseenter={() => (walletIconHover = true)}
    on:mouseleave={() => (walletIconHover = false)}>
    <div class="image navigation-icon">
      {#if $store.userAddress}
        <User color={walletIconHover ? '#333' : '#B5B5B5'} />
      {:else}
        <XCircle color={walletIconHover ? '#333' : '#B5B5B5'} />
      {/if}
    </div>
    <span class={walletIconHover ? 'has-text-black' : 'has-text-grey-light'}>
      Wallet
    </span>
  </div>
</div>
