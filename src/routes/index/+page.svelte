<script>
  import { threads } from '../../utils/store';
</script>

<div class="max-w-7xl mx-auto h-screen mt-[64px] pt-4">
  <h1 class="m-4 text-lg">XBOX総合スレ 　第４避難所</h1>

  <div class="mx-4 pb-4 px-4 rounded-md overflow-y-scroll tindex-bg">
    <div class="relative space-y-2 divide-y divide-base-300">
      {#each $threads as thread}
        <a href="/thread/{thread.id}" class="block max-w-md">
          <div class="max-w-md flex justify-between pt-2">
            <p>{thread.title}</p>
            <p>({thread.comments})</p>
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>
