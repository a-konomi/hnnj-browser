<script>
  import classes from 'svelte-transition-classes';
  import Settings from "$components/Layouts/Settings.svelte";

  import { onMount } from 'svelte'
  import { themeChange } from 'theme-change'

  export let closeDrawer = undefined
  // export let show_drawer

  onMount(() => {
    themeChange(false)
    // 👆 false parameter is required for svelte
  })
</script>

<div class="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
  <!--
    Background backdrop, show/hide based on slide-over state.

    Entering: "ease-in-out duration-500"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in-out duration-500"
      From: "opacity-100"
      To: "opacity-0"
  -->
  <div in:classes="{{
          duration: 500,
          base: 'ease-in-out duration-500',
          from: 'opacity-0',
          to: 'opacity-100',
        }}"
       out:classes="{{
          duration: 500,
          base: 'ease-in-out duration-500',
          from: 'opacity-100',
          to: 'opacity-0',
        }}"
       on:click|preventDefault={closeDrawer}
       class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div class="pointer-events-none fixed inset-0 overflow-hidden">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <!--
          Slide-over panel, show/hide based on slide-over state.

          Entering: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-full"
            To: "translate-x-0"
          Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
            From: "translate-x-0"
            To: "translate-x-full"
        -->
        <div in:classes="{{
                duration: 1500,
                base: 'transform transition ease-in-out duration-500 sm:duration-700',
                from: 'translate-x-full',
                to: 'translate-x-0',
              }}"
             out:classes="{{
                duration: 800,
                base: 'transform transition ease-in-out duration-500 sm:duration-700',
                from: 'translate-x-0',
                to: 'translate-x-full',
              }}"
             class="pointer-events-auto w-screen max-w-sm">
          <div class="flex h-full flex-col overflow-y-scroll bg-base-100 py-6 shadow-xl">
            <div class="relative mt-6 flex-1 px-4 sm:px-6">
              <!-- Replace with your content -->
              <Settings/>
              <!-- /End replace -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
