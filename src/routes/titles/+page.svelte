<script>
  import { supabase } from "$lib/supabaseClient"
  import {find} from "lodash-es";

  let loading = true

  /**
   * @type {any[]}
   */
  let titles = []

  let title = ''
  let cover_url = ''

  $: info_complete = (title !== '' && cover_url !== '')

  async function getTitles() {
    try {
      loading = true;

      await supabase.from("titles")
          .select(`title, cover_url`)
          .then(({ data, error, status }) => {
            if (data) {
              titles = data
              // console.log(titles)
            }
            if (error && status !== 406) throw error;
          });
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false
    }
  }

  getTitles()

  async function createTitle() {
    try {
      loading = true;

      await supabase.from("titles")
          .insert([{
            title, cover_url
          }])
          .then(({ data, error, status }) => {
            if (data) {
              title = ''
              cover_url = ''
              getTitles()
              return true
              // standbys = data
              // console.log(standbys)
            }
            if (error && status !== 406) throw error;
          });
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false
    }
  }

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

  function showCover(node, _path) {
    // console.log(path)
    supabase.storage
        .from('covers')
        .download(_path)
        .then(({ data, error }) => {
          if (error) throw error
          node.src = URL.createObjectURL(data)
          // console.log(new_cover_url)
        })
        .catch((error) =>
            console.error('Error downloading image: ', error.message)
        )
  }
</script>

<div class="max-w-7xl mx-auto py-6 px-2 sm:px-0 mt-[64px] sm:grid sm:grid-cols-3 sm:gap-6">
  <div class="sm:col-span-1 sm:order-last">
    <div class="card bg-base-100 shadow-xl">
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
        <h2 class="card-title">新しい ｽﾃﾝﾊﾞｰｲ… タイトル</h2>
        <p>エキサイティング！</p>
        <form>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">ゲームタイトル</span>
            </label>
            <input bind:value={title} required type="text" placeholder="ペグル" class="input input-bordered w-full max-w-xs" />
          </div>

          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">カバーイメージ</span>
            </label>
            <input bind:value={cover_url} type="text" disabled placeholder="↑の画像からイメージをうpください" class="input input-bordered w-full max-w-xs" />
          </div>
        </form>
        <div class="card-actions justify-center">
          <button on:click|preventDefault={createTitle} disabled={(!info_complete || loading)} class="btn btn-primary btn-block">タイトル追加を確認</button>
        </div>
      </div>
    </div>
  </div>

  <div class="sm:col-span-2">
    <h1 class="mb-2 text-lg">現在あるタイトル <a href="/standby" class="ml-3 underline"><small>ｽﾃﾝﾊﾞｰｲに戻る</small></a></h1>
    <div class="grid grid-cols-3 gap-4">
      {#each titles as title}
        <div class="card max-h-48 bg-base-100 shadow-xl image-full">
          <figure>
            <img class="h-full w-full object-cover" use:showCover={title.cover_url} src="" alt="Shoes" />
          </figure>
          <div class="card-body">
            <h2 class="card-title">{title.title}</h2>
<!--            <p>{title.cover_url}</p>-->
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>