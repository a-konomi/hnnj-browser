<script>
  import {supabase} from "$lib/supabaseClient.js";
  import SveltyPicker from 'svelty-picker'
  import { jp } from 'svelty-picker/i18n';

  export let loading = false
  export let refetch = undefined
  export let changeView = undefined

  let mode = 'create'
  let view = 'dayGridMonth'

  export function editMode(evt) {
    mode = 'edit'
    drawer.checked = true
    event = {
      id: evt.extendedProps.supa_id,
      title: evt.title,
      release_date: evt.extendedProps.release_date,
      game_pass: evt.extendedProps.game_pass,
      day_one: evt.extendedProps.day_one,
      memo: evt.extendedProps.memo,
      cover_url: evt.extendedProps.cover_url,
      store_url: evt.extendedProps.store_url,
      versions: evt.extendedProps.versions,
      status: evt.extendedProps.status,
      smart_deli: evt.extendedProps.smart_deli,
      xs_enhd: evt.extendedProps.xs_enhd,
    }
    cover_url = evt.extendedProps.cover_url
    path = evt.extendedProps.cover_url
  }

  let drawer = undefined
  let form = undefined
  let cover_url = ''

  let event = undefined
  let versions = "{}"
  resetEvent()

  let info_complete = false
  $: info_complete = (event.title !== '' && event.release_date !== '')

  function resetEvent() {
    event = {
      title: '',
      release_date: '',
      game_pass: false,
      day_one: false,
      smart_deli: false,
      xs_enhd: false,
      memo: undefined,
      cover_url: undefined,
      store_url: undefined,
      versions: {},
      status: 0
    }

    mode = 'create'
  }

  async function createEvent() {
    try {
      loading = true;

      await supabase.from("events")
          .insert([{
            title: event.title,
            release_date: new Date(event.release_date).toISOString(),
            game_pass: event.game_pass,
            day_one: event.day_one,
            smart_deli: event.smart_deli,
            xs_enhd: event.xs_enhd,
            memo: event.memo,
            cover_url: event.cover_url,
            store_url: event.store_url,
            versions: event.versions,
            status: event.status
          }])
          .single()
          .then(({ data, error, status }) => {
            if (data) {
              drawer.checked = false
              form.reset()
              resetEvent()
              versions = "{}"
              // ec.refetchEvents()
              refetch()
              files = []
              path = undefined
              return true
              // standbys = data
              // console.log(standbys)
            }
            if (error && status !== 406) throw error;
          })
      // .then(()=>{ getStandbys() })
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false
    }
  }

  async function updateEvent() {
    try {
      loading = true;

      await supabase.from("events")
          .update({
            title: event.title,
            release_date: new Date(event.release_date).toISOString(),
            game_pass: event.game_pass,
            day_one: event.day_one,
            smart_deli: event.smart_deli,
            xs_enhd: event.xs_enhd,
            memo: event.memo,
            cover_url: event.cover_url,
            store_url: event.store_url,
            versions: event.versions,
            status: event.status
          })
          .match({ id: event.id })
          .single()
          .then(({ data, error, status }) => {
            if (data) {
              drawer.checked = false
              form.reset()
              resetEvent()
              versions = "{}"
              // ec.refetchEvents()
              refetch()
              files = []
              path = undefined
              return true
              // standbys = data
              // console.log(standbys)
            }
            if (error && status !== 406) throw error;
          })
      // .then(()=>{ getStandbys() })
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false
    }
  }

  // cover upload
  let uploading = false
  let has_image = false
  let files = undefined
  let path = undefined
  let src = undefined

  async function uploadCover() {
    try {
      uploading = true

      if (!files || files.length === 0) {
        throw new Error('イメージファイルを選べ(´・ω・｀)')
      }

      const file = files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
          .from('covers')
          .upload(filePath, file)

      if (uploadError) throw uploadError

      path = filePath
      cover_url = path
      event.cover_url = cover_url
      has_image = true
      // dispatch('upload')
    } catch (error) {
      alert(error.message)
    } finally {
      uploading = false
    }
  }

  function downloadImage() {
    supabase.storage
        .from('covers')
        .download(path)
        .then(({ data, error }) => {
          if (error) throw error
          src = URL.createObjectURL(data)
        })
        .catch((error) =>
            console.error('Error downloading image: ', error.message)
        )
  }

  function handleViewChange(e) {
    view = e.currentTarget.dataset.view
    changeView(e)
  }

  function handleShowExport(e) {

  }
</script>

<div class="h-14">
  <div class="drawer drawer-end">
    <input bind:this={drawer} id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content max-h-14">
      <!-- Page content here -->
      <div class="flex items-center justify-between mr-4 sm:mr-0">
        <div class="flex flex-grow justify-center">
          <label for="my-drawer" class="btn btn-sm btn-primary btn-outline">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            タイトルを追加
          </label>

          <div class="btn-group ml-3">
            <button on:click={handleViewChange} class:btn-active={view === 'dayGridMonth'} data-view="dayGridMonth" class="btn btn-sm btn-secondary btn-outline">
              <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
              </svg>
            </button>
            <button on:click={handleViewChange} class:btn-active={view === 'listMonth'} data-view="listMonth" class="btn btn-sm btn-secondary btn-outline">
              <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </button>
          </div>
        </div>

        <label for="export-modal" class="btn btn-sm btn-secondary btn-outline ml-1">
          テンプレ出力
        </label>
      </div>
    </div>
    <div class="drawer-side overflow-y-auto">
      <label for="my-drawer" class="drawer-overlay"></label>
      <div class="menu w-96 text-base-content">
        <!-- Sidebar content here -->

        <div class="card w-96 bg-base-100 shadow-xl">
          <figure class="relative">
            {#if path}
              <img use:downloadImage
                   {src}
                   alt="cover"
                   class="max-h-64 h-full w-full object-cover">
            {:else}
              <img class="max-h-64 h-full w-full object-cover" src="https://d2fda0vykczvmk.cloudfront.net/images/placers/wcovers/jimmy.jpg" alt="cover" />
            {/if}
            <label for="cover" class="absolute inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100">
              <span>{uploading ? 'うp中 ...' : 'うp'}</span>
              <span class="sr-only">cover photo</span>
              <input type="file" id="cover" name="cover" accept="image/*"
                     bind:files on:change="{uploadCover}" disabled="{uploading}"
                     class="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md">
            </label>
          </figure>
          <div class="card-body">
            <h2 class="card-title">
              {#if mode === 'create'}
                タイトルを追加
              {:else}
                タイトルを編集
              {/if}
            </h2>
            <form bind:this={form}>

              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">ゲームタイトル</span>
                </label>
                <input bind:value={event.title} required type="text" placeholder="夜な夜なペグル" class="input input-bordered w-full max-w-xs" />
              </div>

              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">メモ</span>
                </label>
                <textarea bind:value={event.memo} class="textarea textarea-bordered" placeholder="メモ"></textarea>
              </div>

              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">発売日</span>
                </label>
                <div class="grid grid-cols-2 gap-x-2">
                  <SveltyPicker i18n={jp} inputClasses="input input-bordered w-full max-w-xs" format="yyyy-mm-dd" bind:value={event.release_date}></SveltyPicker>
                </div>
              </div>

              <div class="form-control w-full max-w-xs">
                <label class="label cursor-pointer">
                  <span class="label-text">ゲームパス対応</span>
                  <input bind:checked={event.game_pass} type="checkbox" class="checkbox checkbox-primary" />
                </label>
                {#if event.game_pass}
                  <label class="label cursor-pointer">
                    <span class="label-text">Day One</span>
                    <input bind:checked={event.day_one} type="checkbox" class="checkbox checkbox-primary" />
                  </label>
                {/if}
              </div>

              <div class="form-control w-full max-w-xs">
                <label class="label cursor-pointer">
                  <span class="label-text">X|S 最適化</span>
                  <input bind:checked={event.xs_enhd} type="checkbox" class="checkbox checkbox-primary" />
                </label>
                <label class="label cursor-pointer">
                  <span class="label-text">スマートデリバリー</span>
                  <input bind:checked={event.smart_deli} type="checkbox" class="checkbox checkbox-primary" />
                </label>
              </div>

              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">ストアリンク</span>
                </label>
                <input bind:value={event.store_url} required type="text" placeholder="https://www.xbox.com/..." class="input input-bordered w-full max-w-xs" />
              </div>

              <!--                  <div class="form-control w-full max-w-xs">-->
              <!--                    <label class="label">-->
              <!--                      <span class="label-text">バージョン(任意)</span>-->
              <!--                    </label>-->
              <!--                    <textarea bind:value={versions} class="textarea textarea-bordered" placeholder=""></textarea>-->
              <!--                  </div>-->

            </form>

            <div class="divider"></div>

            <div class="card-actions justify-center">
              <button on:click|preventDefault={()=> (mode === 'create') ? createEvent() : updateEvent()}
                      disabled={!info_complete || uploading} class="btn btn-primary btn-block">GO!</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>