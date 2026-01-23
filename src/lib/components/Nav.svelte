<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
  
    const navItems = [
      { label: 'Mike Grail', path: '/' },
      { label: 'About', path: '/about' }
      // { label: 'Submit', path: '/submit' }
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
        ><p>
          {item.label}
        </p>
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
      padding: 10px 0; 
    }

    nav button {
      padding-left: 20px;
    }
  
    nav button:first-child {
      margin-right: auto;
      padding-left: 0;
    }
  </style>
  