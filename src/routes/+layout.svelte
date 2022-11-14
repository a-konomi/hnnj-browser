<script>
  import "../app.css";
  import { proxy_url, threads, latest_id } from '../utils/store';

  import { onMount } from 'svelte'
  import { themeChange } from 'theme-change'

  import NavBar from "../components/Layouts/NavBar.svelte";
  import Drawer from "../components/Layouts/Drawer.svelte";

  /** @type {import('./$types').LayoutData} */
  export let data

  $proxy_url = data.proxy_url
  // console.log($proxy_url)
  $threads = data.threads
  // console.log($threads)
  $latest_id = ($threads) ? $threads[0].id : ''

  let show_drawer = false

  function toggleDrawer(e) {
    show_drawer = !show_drawer
  }

  function closeDrawer(e) {
    show_drawer = false
  }

  onMount(() => {
    themeChange(false)
    // 👆 false parameter is required for svelte
  })
</script>

<NavBar toggleDrawer={toggleDrawer} />

<slot />

{#if show_drawer}
<Drawer show_drawer={show_drawer} closeDrawer={closeDrawer} />
{/if}

<!--<div class="drawer">-->
<!--  <input id="my-drawer" type="checkbox" class="drawer-toggle" />-->
<!--  <div id="content_root" class="drawer-content">-->
<!--    &lt;!&ndash; Page content here &ndash;&gt;-->
<!--    <div>-->
<!--      <NavBar />-->

<!--      <slot />-->
<!--    </div>-->
<!--  </div>-->
<!--  <Settings/>-->
<!--</div>-->
