<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
  
    const navItems = [
      { label: 'Mike Grail', path: '/' },
      { label: 'About', path: '/about' }
    ];
  
    function navigate(path: string) {
      goto(path);
    }
  </script>
  <nav>
    <div class = "nav-inner">
      {#each navItems as item}
        <button
          class:active={$page.url.pathname === item.path}
          on:click={() => navigate(item.path)}
        ><h2>
          {item.label}
        </h2>
        </button>
      {/each}
    </div>
  </nav>
  
  <style>
    nav {
      position: sticky;
      top: 0;
      z-index: 1000; 
      width: 100%;
    }

    .nav-inner {
      max-width: 1500px;
      display: flex;      
      background-color: var(--color-bg);
      padding: 5px 0; 
    }
  
    nav button:first-child {
      margin-right: auto;
      padding-left: 0;
    }
  </style>
  