<script>
  import { find } from 'lodash-es';
  import axios from 'axios';
  import { threads, proxy_url, breed } from "$utils/store.js";
  // import { slide } from 'svelte/transition';

  import SweetScroll from 'sweet-scroll';
  import { onMount } from 'svelte';

  import OutClick from 'svelte-outclick'
  import { Jumper } from 'svelte-loading-spinners'

  import { page } from '$app/stores';
  import CommentsList from "../../../components/Comments/CommentsList.svelte";

  let comments = undefined
  let thread = find($threads, {id: $page.params.id})
  let loading = undefined
  // console.log(thread)

  // submits
  let text_input = undefined
  let msg = ''
  let disable_send = true

  function reload(e) {
    comments.loadComments()
  }

  function shobon(e) {
    text_input.focus()
    const [start, end] = [text_input.selectionStart, text_input.selectionEnd];
    text_input.setRangeText($breed, start, end, 'end');
    msg = text_input.value
    // msg = msg + '(´・ω・｀)'
  }

  function insertRes(e) {
    if (!show_input) show_input = true

    let target = '>>' + e.target.innerHTML

    setTimeout(()=>{
      text_input.focus()
      const [start, end] = [text_input.selectionStart, text_input.selectionEnd];
      text_input.setRangeText(target, start, end, 'end');
    }, 200)
  }

  function kakikomi(e) {
    let params = new URLSearchParams();
    params.append('id', thread.id);
    params.append('msg', msg);

    let url = $proxy_url + '/write'

    if (!disable_send) {
      axios.post(url, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        comments.loadComments()
        msg = ''
        show_input = false
      })
    }

    comments.loadComments()
  }

  // show/hide kakikomi
  let show_input = false

  function toggleInput(e) {
    show_input = !show_input
  }

  function hideInput(e) {
    show_input = false
  }

  function toBottom(e) {
    // let root = document.getElementById('content_root')
    // let bottom = root.scrollHeight - root.clientHeight
    scroller.to('#threads_bottom')
    // root.scrollTo({
    //   top: bottom,
    //   left: 0,
    //   behavior: 'smooth'
    // })
  }

  function toNext(e) {
    // let root = document.getElementById('content_root')
    // let bottom = root.scrollHeight - root.clientHeight
    scroller.to('+=' + window.innerHeight, {duration: 600})
    // root.scrollTo({
    //   top: bottom,
    //   left: 0,
    //   behavior: 'smooth'
    // })
  }

  let scroller = undefined

  onMount(()=>{
    // let root = document.getElementById('content_root')
    scroller = new SweetScroll(
        {
          duration: 1200,
          easing: 'easeInOutCubic',
        }
    );
  })

  // for test mode
  const seq = '38384040373937396665'
  let inp = []
  function onKeyDown(e) {
    inp.push(e.keyCode)
    if (inp.length >= 10) {
      // console.log(inp.join(''))
      if (inp.join('') === seq) {
        disable_send = false
        // console.log('!')
      } else {
        inp = []
      }
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="sm:px-4 py-3 mt-[64px] pb-24 prose max-w-7xl mx-auto bg-base-200">
  <h3 class="px-4 sm:px-0">{thread.title}</h3>

  <CommentsList bind:this={comments} bind:loading={loading}
                thread_id="{thread.id}"
                insertRes={insertRes} />

  {#if !loading}
    <div id="threads_bottom" class="divider">最新レスです</div>
    <div class="flex justify-center sm:text-left">
      <button on:click|preventDefault={reload} class="btn btn-outline btn-primary btn-wide">リロード</button>
    </div>
  {:else}
    <div class="flex justify-center">
      <Jumper color="#0e7a0d" />
    </div>
  {/if}
</div>

<!--{#if show_input}-->
<!--<OutClick on:outclick={hideInput}>-->
  <div class:hidden={!show_input} class="fixed bottom-12 w-full max-w-screen-sm sm:max-w-none px-4 py-3 bg-base-300">
    <textarea bind:this={text_input} bind:value={msg} placeholder="投稿機能は現在未公開です(´・ω・｀)" name="msg" id="msg" rows="6" class="w-full textarea textarea-bordered text-base"></textarea>
    <div class="flex space-x-4">
      <button on:click|preventDefault={kakikomi} disabled={disable_send} class="btn btn-primary mr-2">書き込み</button>
      <button on:click|preventDefault={shobon} class="btn btn-outline btn-secondary lowercase">{$breed}を注入</button>
      <button on:click|preventDefault={hideInput} class="btn btn-outline btn-secondary lowercase">閉じる</button>
    </div>
    <p class="text-xs mt-1">*投稿機能は現在未公開です(´・ω・｀)</p>
  </div>
<!--</OutClick>-->
<!--{/if}-->

{#if !loading}
<div class="btm-nav btm-nav-sm">
  <button on:click|preventDefault={toggleInput}>
    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  </button>
  <button on:click|preventDefault={reload}>
    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  </button>
  <button on:click|preventDefault={toBottom}>
    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
    <span class="text-xs">最新レスへ</span>
  </button>
  <button on:click|preventDefault={toNext}>
    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
    <span class="text-xs">次を表示</span>
  </button>
</div>
{/if}