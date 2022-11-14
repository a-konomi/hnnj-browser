<script>
  import { supabase } from "$lib/supabaseClient"
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { Jumper } from 'svelte-loading-spinners'

  let loading = false
  let exp_string = undefined

  // get events
  export async function getEvents() {
    let events = []
    let today = new Date()

    try {
      loading = true;

      let cur_month = today.getMonth() + 1
      let next_month = (cur_month === 12) ? 1 : cur_month + 1

      await supabase.from("events")
          .select(`title, release_date, game_pass, smart_deli, xs_enhd`)
          .gte('release_date', today.toISOString())
          .order('release_date', { ascending: true })
          .then(({ data, error, status }) => {
            if (data) {
              events = data
              events = events.map((e)=>{
                let date = e.release_date.split('-')
                date.shift()
                date = date.join('/')

                let res = date + ' ' + e.title

                if (e.xs_enhd) res += ' ☆'
                if (e.smart_deli) res += ' ●'
                if (e.game_pass) res += ' ◇'

                return res
              })

              exp_string = '【Xbox リリース スケジュール（'+cur_month+'-'+next_month+'月）】\n' +
                  '☆: Xbox Seres X|S 最適化　●: アップグレード対応　◇: ゲームパス対応\n'

              exp_string += events.join('\n')

              exp_string += '\n\nリリーススケジュール フル\n' +
                  'ttps://note.com/hnnj4/n/ndb753b689e23'
              // console.log(exp_string)
            }
            if (error && status !== 406) throw error;
          });
    } catch (error) {
      alert(error.message);
    } finally {
      loading = false
    }

    // return events
  }

  function handleUpdate(e) {
    if (e.currentTarget.checked) getEvents()
    else exp_string = undefined
  }

  let copied = false

  function handleCopy(e) {
    // clip.select()
    // document.execCommand('copy')
    navigator.clipboard.writeText(exp_string)
        .then(
            success => {
              copied = true
              setTimeout(()=>{
                copied = false
              }, 1500)
            }
            // success => alert('テキストのコピーに成功😆'),
            // error => alert('テキストのコピーに失敗😫')
        );
  }
</script>

<input type="checkbox" id="export-modal" on:change={handleUpdate} class="modal-toggle" />
<label for="export-modal" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    {#if exp_string}
      <h3 class="text-lg font-bold">テンプレプレビュー</h3>
      <button on:click|preventDefault={handleCopy} class="btn btn-primary btn-block">テンプレをコピー</button>
      <textarea value="{exp_string}" rows="10" class="mt-1 textarea textarea-bordered w-full whitespace-pre overflow-x-auto"></textarea>
      {#if copied}
        <div transition:slide="{{delay: 250, duration: 300, easing: quintOut }}" class="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>テンプレのコピーに成功(´・ω・｀)</span>
          </div>
        </div>
      {/if}
    {:else}
      <div class="flex justify-center">
        <Jumper color="#0e7a0d" />
      </div>
    {/if}
  </label>
</label>