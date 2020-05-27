<script>
  import { push } from "svelte-spa-router";
</script>

<style>
  .landing-col {
    padding: 50px 10px;
  }

  .home-img {
    max-width: 400px;
  }

  .home-img-mobile {
    width: 100%;
    margin-bottom: 30px;
  }

  .controls {
    justify-content: center;
  }
</style>

<section class="section">
  <div class="container">
    <div class="box">
      <div class="columns is-vcentered">
        <div class="column is-half has-text-centered landing-col">
          <div class="title is-4">Learn more about TZIP-7 tokens!</div>
          <br />
          <img
            src="images/undraw_wallet_aym5.svg"
            alt="wallet"
            class="home-img-mobile is-hidden-desktop" />
          <div class="subtitle is-5">
            Use this website to browse FA1.2 tokens on the Carthage network,
            create your own tokens, transfer them and buy other people's tokens!
          </div>
          <div class="subtitle is-6">
            The goal of this website is to familiarize yourself with tokens on
            the Tezos blockchain, how to create them and interact with them from
            a dapp interface.
          </div>
          <div class="subtitle is-6">
            A few things have been simplified compared to a real-case fungible
            token in order to make the approach easier for beginners.
            <br />
            For example, you will be allowed to set your own price for your
            token here although the price in a real-case token may depend on
            different variables.
          </div>
          <br />
          <div class="buttons controls">
            <button class="button is-success" on:click={() => push('/create')}>
              Create a token
            </button>
            <button class="button is-link" on:click={() => push('/manage')}>
              Manage your token
            </button>
          </div>
        </div>
        <div
          class="column is-half has-text-centered is-hidden-mobile landing-col">
          <img
            src="images/undraw_wallet_aym5.svg"
            alt="wallet"
            class="home-img" />
        </div>
      </div>
    </div>
  </div>
</section>
