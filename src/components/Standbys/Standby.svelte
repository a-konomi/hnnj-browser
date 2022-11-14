<script>
  import { supabase } from "$lib/supabaseClient"
  // import { rooms } from '$utils/store'
  // import {find} from "lodash-es";
  import { onMount } from 'svelte';

  export let standby
  export let title
  export let updateTag

  let src = undefined
  let loading = false

  let attenders = standby.attenders
  let slots = standby.slots
  let percent = standby.percent
  let status = standby.status
  let begins_at = new Date(standby.begins_at)
  let ends_at = new Date(standby.ends_at)

  let d_format = {month: "short", day: "numeric", hour: "numeric", minute: "numeric"}

  function showCover() {
    supabase.storage
        .from('covers')
        .download(title.cover_url)
        .then(({ data, error }) => {
          if (error) throw error
          src = URL.createObjectURL(data)
          // console.log(new_cover_url)
        })
        .catch((error) =>
            console.error('Error downloading image: ', error.message)
        )
  }

  async function updateStandby() {
    try {
      loading = true;
      percent = parseInt((attenders / slots) * 100)

      await supabase.from("standbys")
          .update({
            attenders, percent, status
          })
          .match({ id: standby.id })
          .single()
          .then(({ data, error, _status }) => {
            if (data) {
              attenders = data.attenders
              percent = data.percent
              status = data.status
              // console.log(data)
              // console.log(data.attenders)
              return true
              // standbys = data
              // console.log(standbys)
            }
            if (error && _status !== 406) throw error;
          });
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false
    }
  }

  function attenderPlus(e) {
    if (attenders < slots) {
      attenders += 1
      updateStandby()
    }
  }

  function attenderMinus(e) {
    if (attenders > 1) {
      attenders -= 1
      updateStandby()
    }
  }

  function toggleStatus(e) {
    status = (status === 0) ? 1 : 0
    updateStandby()
  }

  let created_room = false

  onMount(()=>{
    let rooms = localStorage.getItem('rooms')
    if (rooms !== null) {
      created_room = (rooms.split(',').includes(String(standby.id)))
    }
  })
</script>

<div class="card glass">
  <figure>
    <img class="max-h-36 h-full w-full object-cover" use:showCover src="{src}" alt="{title.title}" />
  </figure>
  <div class="card-body">
    {#if status === 0}
      <span class="badge badge-primary">募集中</span>
    {:else}
      <span class="badge badge-accent">締め切り</span>
    {/if}
    <h2 class="card-title">{title.title}</h2>
    <div class="h-16 overflow-y-auto">
      <p class="text-sm whitespace-pre-line">{standby.memo}</p>
    </div>
    <div class="text-xs">
      募集期間：{begins_at.toLocaleString(undefined, d_format)} ~ {ends_at.toLocaleString(undefined, d_format)}
      <p>
        参加状況：<span class="text-sm">{attenders} / {standby.slots}</span>
      </p>
    </div>
    <div class="text-sm flex items-center justify-end">
      {#if created_room}
      <button class="btn btn-xs mr-2" disabled={loading} on:click={toggleStatus}>
        {#if status === 1}
          募集中にする
        {:else}
          締め切りにする
        {/if}
      </button>

      <button class="btn btn-circle btn-xs mr-2" disabled={loading} on:click={attenderMinus}>
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <button class="btn btn-circle btn-xs" disabled={loading} on:click={attenderPlus}>
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      {/if}
    </div>
    <hr class="border-gray-500 my-2">
    <div class="card-actions justify-end">
      <div class="radial-progress text-primary text-xs mr-2" style="--value:{percent}; --size:3rem; --thickness: 2px;">{percent}%</div>
      <!-- The button to open modal -->
      <label for="my-modal" class="btn btn-primary" on:click={() => updateTag(standby.gamer_tag)}>乗り込めー!!</label>
    </div>
  </div>
</div>