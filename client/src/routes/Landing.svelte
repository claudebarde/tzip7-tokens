<script>
  import Presentation from "../components/Landing/Presentation.svelte";
  import FindToken from "../components/Landing/FindToken.svelte";
  import LastTokens from "../components/Landing/LastTokens.svelte";
</script>

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
