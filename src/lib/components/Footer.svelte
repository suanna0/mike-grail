<script lang="ts">
    export const title = "Footer";
    function backToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
</script>
  
<footer>    
    <button class="button"><a target = "_blank" href = "https://suannazhong.com">Suanna Zhong</a>, 2026</button>
    <button class="button" on:click={backToTop}>
        Back to Top ↑
    </button>
</footer>

  
<style>
    footer {
        padding-top: 20px;
        display: flex;
        margin: 0 auto;
    }

    footer button:first-child {
        margin-right: auto;
    }

    footer button {
        background-color: transparent;
    }
</style>