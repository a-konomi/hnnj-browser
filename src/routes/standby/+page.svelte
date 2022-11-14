<script>
  import { supabase } from "$lib/supabaseClient"
  import { find } from 'lodash-es';
  import SveltyPicker from 'svelty-picker'
  // import { rooms } from '$utils/store'
  import { onMount } from 'svelte';

  import Standby from "$components/Standbys/Standby.svelte";

  let loading = true
  let rooms = []

  onMount(()=>{
    // console.log(localStorage.getItem("rooms"))
    const storedRooms = localStorage.getItem("rooms");
    // const storedRooms = "21,22"
    // localStorage.setItem("rooms", "21,22")
    rooms = (storedRooms !== null && storedRooms !== '') ? storedRooms.split(',') : []
  })

  /**
   * @type {any[]}
   */
  let standbys = undefined
  let titles = undefined

  let title = ''
  let memo = ''
  let gamer_tag = ''
  let game_title = 1
  let status = 0
  let slots = 4
  let attenders = 1
  let percent = 0
  let begins_at = new Date().toLocaleString()
  let ends_at = new Date(Date.now() + 2 * (60 * 60 * 1000)).toLocaleString()

  let new_cover_url = 'https://placeimg.com/400/225/arch'
  let drawer = undefined
  let form = undefined

  let tag = undefined

  $: info_complete = (begins_at !== '' && ends_at !== '' && gamer_tag !== '' && game_title !== undefined && slots >= 2 && attenders >= 1)

  async function getTitles() {
    try {
      loading = true;

      await supabase.from("titles")
          .select(`id, title, cover_url`)
          .then(({ data, error, status }) => {
            if (data) {
              titles = data
              downloadImage(titles[0].cover_url)
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

  async function getStandbys() {
    try {
      loading = true;

      let date = new Date()
      date.setHours(6,0,0,0)
      // console.log(date.toISOString())

      await supabase.from("standbys")
          .select(`id, title, gamer_tag, game_title, status, slots, attenders, percent, memo, begins_at, ends_at`)
          .gte('ends_at', date.toISOString())
          .order('id', { ascending: false })
          .then(({ data, error, status }) => {
            if (data) {
              standbys = data
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

  getStandbys()

  async function createStandby() {
    try {
      loading = true;
      percent = parseInt((attenders / slots) * 100)

      await supabase.from("standbys")
          .insert([{
            title, gamer_tag, game_title, status, slots, attenders, percent, memo,
            begins_at: new Date(begins_at).toISOString(),
            ends_at: new Date(ends_at).toISOString()
          }])
          .single()
          .then(({ data, error, status }) => {
            if (data) {
              drawer.checked = false
              form.reset()
              // console.log(created_rooms)
              rooms.push(String(data.id))
              localStorage.setItem('rooms', rooms.join(','))
              // console.log($rooms)
              return true
              // standbys = data
              // console.log(standbys)
            }
            if (error && status !== 406) throw error;
          })
          .then(()=>{ getStandbys() })
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false
    }
  }

  function downloadImage(path) {
    // console.log(path)
    supabase.storage
        .from('covers')
        .download(path)
        .then(({ data, error }) => {
          if (error) throw error
          new_cover_url = URL.createObjectURL(data)
          // console.log(new_cover_url)
        })
        .catch((error) =>
            console.error('Error downloading image: ', error.message)
        )
  }

  function updateCover(e) {
    let id = parseInt(e.target.value)
    // console.log(id)
    let _title = find(titles, t => {
      return t.id === id
    })

    // console.log(id)
    // console.log(title)
    if (_title) downloadImage(_title.cover_url)
  }

  function getGameTitle(gid) {
    // console.log(id)
    let _title = find(titles, t => {
      return t.id === gid
    })

    // console.log(id)
    // console.log(title)
    if (_title) {
      return _title
    }
  }

  function updateTag(_tag) {
    tag = _tag
  }
</script>

<div class="max-w-7xl mx-auto py-6 mt-[64px]">

  <!-- Put this part before </body> tag -->
  <input type="checkbox" id="my-modal" class="modal-toggle" />
  <label for="my-modal" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
      <h3 class="text-lg font-bold">主のタグ：</h3>
      <h1 class="text-7xl py-4 text-center">{tag}</h1>
      <p class="text-sm py-4 text-center">Xboxもしくはゲーム内で、<br>主宛にメッセージを送ってください</p>
    </label>
  </label>

  {#if standbys && titles}
  <div class="h-14">
    <div class="drawer drawer-end">
      <input bind:this={drawer} id="my-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <!-- Page content here -->
        <label for="my-drawer" class="btn btn-primary drawer-button ml-4 sm:ml-0">ｽﾃﾝﾊﾞｰｲを追加</label>
      </div>
      <div class="drawer-side">
        <label for="my-drawer" class="drawer-overlay"></label>
        <ul class="menu overflow-y-auto w-96 text-base-content">
          <!-- Sidebar content here -->

          <div>
            <div class="card w-96 bg-base-100 shadow-xl">
              <figure class="relative">
                <img class="max-h-48 h-full w-full object-cover" src="{new_cover_url}" alt="Shoes" />
              </figure>
              <div class="card-body">
                <h2 class="card-title">ｽﾃﾝﾊﾞｰｲ…</h2>
                <p>エキサイティング！</p>
                <form bind:this={form}>
                  <div class="form-control w-full max-w-xs">
                    <div class="form-control w-full max-w-xs">
                      <label class="label">
                        <span class="label-text">ゲームタイトル</span>
                        <a href="/titles" class="text-sm underline">タイトルを追加</a>
                      </label>
                      <select bind:value={game_title} on:change={updateCover} required class="select select-bordered">
                        <option disabled selected>募集タイトルを選べ</option>
                        {#each titles as _title }
                          <option value="{_title.id}">{_title.title}</option>
                        {/each}
                      </select>
                    </div>
                  </div>

                  <div class="form-control w-full max-w-xs">
                    <label class="label">
                      <span class="label-text">募集期間 (開始時刻〜終了時刻)</span>
                    </label>
                    <div class="grid grid-cols-2 gap-x-2">
                      <SveltyPicker inputClasses="input input-bordered w-full max-w-xs" format="yyyy-mm-dd hh:ii" bind:value={begins_at}></SveltyPicker>
                      <SveltyPicker inputClasses="input input-bordered w-full max-w-xs" format="yyyy-mm-dd hh:ii" bind:value={ends_at}></SveltyPicker>
                    </div>
                  </div>

                  <div class="form-control w-full max-w-xs">
<!--                    <label class="label">-->
<!--                      <span class="label-text">募集タイトル</span>-->
<!--                    </label>-->
<!--                    <input bind:value={title} required type="text" placeholder="夜な夜なペグル" class="input input-bordered w-full max-w-xs" />-->
                    <label class="label">
                      <span class="label-text">メモ</span>
                    </label>
                    <textarea bind:value={memo} class="textarea textarea-bordered" placeholder="アイサツ・注意事項など"></textarea>
                  </div>

                  <div class="form-control w-full max-w-xs">
                    <label class="label">
                      <span class="label-text">お主のタグ</span>
                    </label>
                    <input bind:value={gamer_tag} required type="text" placeholder="pandaicon1" class="input input-bordered w-full max-w-xs" />
                  </div>

                  <div class="grid grid-cols-2 gap-x-3">
                    <div class="form-control w-full max-w-xs">
                      <label class="label">
                        <span class="label-text">現在人数</span>
                      </label>
                      <input bind:value={attenders} required type="number" placeholder="1" class="input input-bordered w-full max-w-xs" />
                    </div>

                    <div class="form-control w-full max-w-xs">
                      <label class="label">
                        <span class="label-text">最大人数</span>
                      </label>
                      <input bind:value={slots} required type="number" placeholder="4" class="input input-bordered w-full max-w-xs" />
                    </div>
                  </div>

                </form>

                <div class="divider"></div>

                <div class="card-actions justify-center">
                  <button on:click|preventDefault={createStandby} disabled={!info_complete} class="btn btn-primary btn-block">GO!</button>
                </div>
              </div>
            </div>
          </div>

        </ul>
      </div>
    </div>
  </div>

  <div tabindex="0" class="collapse collapse-arrow mx-4 max-w-xl border border-base-300 bg-base-100 rounded-box">
    <div class="collapse-title py-1 min-h-0 text-base font-medium">
      トリセツ
    </div>
    <div class="collapse-content prose">
      <ol>
        <li>「ｽﾃﾝﾊﾞｰｲを追加」ボタンを押す</li>
        <li>
          募集したいゲームタイトルを選ぶ。なかったら「タイトル追加」を押す
          <ol>
            <li>新しいタイトルを入力し、適当なカバーイメージをアップロード</li>
            <li>「タイトル追加を確認」ボタンを押す</li>
            <li>「ｽﾃﾝﾊﾞｰｲに戻る」を押し、ｽﾃﾝﾊﾞｰｲ一覧に戻る</li>
          </ol>
        </li>
        <li>募集用タイトル、メモ、タグなどを入力し、「Go!」ボタンを押す</li>
        <li>あとは応募を待つだけです。参加状況は<i>作成した端末</i>で編集可能です</li>
        <li>作成したｽﾃﾝﾊﾞｰｲを削除する必要はありません。次の日で非表示になります</li>
      </ol>
    </div>
  </div>

  <div class="divider"></div>

  <div class="px-4 space-y-4 sm:px-0 sm:space-y-0">
    <h1 class="text-lg mb-3 flex items-center">
      今日のｽﾃﾝﾊﾞｰｲ
      <div class="tooltip tooltip-right" data-tip="今朝6時以降のｽﾃﾝﾊﾞｰｲ">
        <svg class="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
      </div>
    </h1>

    {#if standbys && standbys.length > 0}
    <div class="grid gap-6 sm:grid-cols-4">
      {#each standbys as standby (standby.id)}
        <Standby standby={standby} updateTag={updateTag} title={getGameTitle(standby.game_title)} />
      {/each}
    </div>
    {:else}
    <div>まだｽﾃﾝﾊﾞｰｲがないようです。今日一番のｽﾃﾝﾊﾞｰｲを作りましょ！</div>
    {/if}
  </div>
  {/if}
</div>