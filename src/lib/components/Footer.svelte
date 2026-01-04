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
    <button class="button" on:click={backToTop}>
        Back to Top ↑
    </button>
</footer>

  
<style>
    footer {
        padding: 10px 0;
        align-items: center;
    }

    footer button {
        background-color: transparent;
        align-items: center;
        justify-content: center;
        display: flex;
        margin: 0 auto;
    }
</style>