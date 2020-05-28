<script>
  import Presentation from "../components/Landing/Presentation.svelte";
  import FindToken from "../components/Landing/FindToken.svelte";
  import LastTokens from "../components/Landing/LastTokens.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<style>
  .ui {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .ui-main {
    flex: 1 0 auto;
  }
  .ui-footer {
    flex-shrink: 0;
  }
</style>

<svelte:head>
  <title>TZIP-7 tokens</title>
</svelte:head>
<div class="ui">
  <div class="ui-main">
    <Presentation />
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-half">
            <FindToken />
          </div>
          <div class="column is-half">
            <LastTokens />
          </div>
        </div>
      </div>
    </section>
  </div>
  <div class="ui-footer">
    <Footer />
  </div>
</div>
