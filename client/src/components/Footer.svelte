<script>
  import store from "../store";
</script>

<style>
  footer {
    padding: 4px;
    display: flex;
    justify-content: space-between;
  }

  .links {
    padding: 5px;
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .logo {
    width: 22px;
    vertical-align: top;
  }
</style>

<footer class="is-size-7">
  <div />
  <div class="text">
    <span>:: Claude Barde 2020 ::</span>
  </div>
  <div class="links">
    <a
      href={`https://you.better-call.dev/carthagenet/${$store.contractAddress}/operations`}
      target="_blank"
      rel="noopener noreferrer">
      <svg
        class="logo"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        stroke="#333"
        viewBox="0 0 24 24">
        <path
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1
          0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </a>
    &nbsp;
    <a
      href="https://github.com/claudebarde/tzip7-tokens"
      target="_blank"
      rel="noopener noreferrer">
      <img class="logo" src="images/GitHub-Mark-32px.png" alt="github" />
    </a>
    &nbsp;
    <a
      href="https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-7/tzip-7.md"
      target="_blank"
      rel="noopener noreferrer">
      <img class="logo" src="images/gitlab-icon-rgb.png" alt="gitlab" />
    </a>
  </div>
</footer>
