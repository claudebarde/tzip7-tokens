<script>
  import moment from "moment";
  import store from "../../store";
  import ExternalLink from "../../icons/ExternalLink.svelte";
</script>

<style>
  .box {
    height: 100%;
  }

  .table-box {
    overflow: auto;
    max-height: 200px;
  }

  @media only screen and (max-width: 1024px) {
    .table-box {
      max-height: 100%;
    }
  }
</style>

<div class="box">
  <p class="title is-6">Transfers History</p>
  <p>
    You can find below your latest transfers with {$store.tokenStorage.metadata.symbol}.
  </p>
  <br />
  {#if $store.transactionsHistory.length === 0}
    <p>No transaction yet!</p>
  {:else}
    <div class="table-box">
      <table class="table is-narrow is-striped is-fullwidth">
        <tbody>
          {#each $store.transactionsHistory as tx}
            <tr>
              <td>
                <p>
                  Transferred {tx.amount.toLocaleString('en-US')} {$store.tokenStorage.metadata.symbol}
                  to {tx.recipient.slice(0, 7) + '...' + tx.recipient.slice(-7)}
                </p>
                <p class="is-italic">
                  On {moment(tx.timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                </p>
                <p>
                  <a
                    href={`https://carthage.tzkt.io/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    {tx.txHash.slice(0, 10) + '...' + tx.txHash.slice(-10)}
                    <ExternalLink />
                  </a>
                </p>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
