<script>
  export let modal_toggle = undefined
  export let info = undefined
  export let showEdit = undefined

  export function updateInfo(_info) {
    info = reduceObjValues(_info)
    // console.log(info)
    modal_toggle.checked = true
  }

  // flatten object to 1 level
  const reduceObjValues = (obj, cache = {}) => {
    const objectValues = Object.keys(obj).reduce((acc, cur) => {
      if (!Array.isArray(obj[cur]) && typeof obj[cur] === 'object') {
        return reduceObjValues({ ...acc, ...obj[cur] }, cache);
      }
      acc[cur] = obj[cur];

      return acc;
    }, {});

    return {
      ...objectValues,
      ...cache,
    };
  }

  function handleEdit(e) {
    showEdit(e)
    modal_toggle.checked = false
  }
</script>

<input bind:this={modal_toggle} type="checkbox" id="event_modal" class="modal-toggle" />
<label for="event_modal" class="modal cursor-pointer">
  <label class="modal-box relative p-0" for="">
    {#if info}
      <div class="card bg-base-100 shadow-xl image-full">
        <figure><img src="{info.cover_src || 'https://d2fda0vykczvmk.cloudfront.net/images/placers/wcovers/x360-06.jpg'}" alt="Cover" /></figure>
        <div class="card-body">
          <h2 class="card-title">{info.title}</h2>
          <div class="flex-grow">
            <p>
              {info.release_date}
              {#if info.game_pass}
                <span class="badge badge-primary badge-xs">Game Pass</span>
              {/if}
              {#if info.day_one}
                <span class="badge badge-secondary badge-xs">Day One</span>
              {/if}
              {#if info.smart_deli}
                <span class="badge badge-secondary badge-xs">Smart Delivery</span>
              {/if}
              {#if info.xs_enhd}
                <span class="badge badge-secondary badge-xs">X|S Enhanced</span>
              {/if}
            </p>
            {#if info.memo}
              <p>{info.memo}</p>
            {/if}
          </div>
          <div class="card-actions justify-between items-baseline">
            <button on:click|preventDefault={handleEdit} data-eid="{info.id}" class="text-sm underline hover:no-underline flex items-center">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
              <span class="ml-1">項目を編集</span>
            </button>
            <a href="{info.store_url}" target="_blank" class="btn btn-primary gap-2">
              ストアへ
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    {/if}
  </label>
</label>