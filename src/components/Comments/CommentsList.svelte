<script>
  import { proxy_url } from "../../utils/store.js";
  import classes from 'svelte-transition-classes';
  import { navigating } from '$app/stores';
  import OutClick from 'svelte-outclick'
  import { find, countBy, groupBy, map, filter } from 'lodash-es';
  import Comment from "./Comment.svelte";

  export let thread_id
  export let loading = false
  export let insertRes

  let comments = undefined

  let url = $proxy_url + '/thread/' + thread_id
  // console.log(url)

  function prepareComments(data) {
    let blocks = data.split('\n')
    let _comments = blocks.map(comm => {
      if (comm === '') return

      const eles = comm.split('<>')
      return {
        res_no: eles[0],
        res_count: 0,
        name: eles[1],
        mail: eles[2],
        date: eles[3],
        body: eles[4],
        title: eles[5],
        id: eles[6]
      }
    })
    _comments = _comments.filter(c => c !== undefined)

    return _comments
  }

  export async function loadComments() {
    loading = true
    let url = $proxy_url + '/thread/' + thread_id
    await fetch(url)
        .then((response) => response.text())
        .then((data) => {
          comments = prepareComments(data)
          loading = false
          // console.log(comments)
        })
  }

  loadComments()

  // photos
  let show_photo = false
  let img_src = ''

  function handleImageClick(e) {
    // console.log(e.target.src)
    img_src = e.target.src
    show_photo = true
  }

  $: if ($navigating) show_photo = false

  function togglePhoto() {
    show_photo = !show_photo
  }

  let comments_div = undefined
  let grouped_anka = undefined

  $: {
    if (comments !== undefined && comments_div !== undefined) {
      let reses = comments_div.querySelectorAll('.anka')
      let ids = Array.from(reses).map(a => {
        return a.dataset.resTarget
      })
      let grouped = groupBy(reses, a => {
        return a.dataset.resTarget
      })
      grouped = Object.fromEntries(
        Object.entries(grouped).map(([k,v]) => {
          // console.log(v)
          return [k,
          v.map(a => {
            return {id: a.dataset.resNum, target: a.dataset.resTarget}
          })]
        })
      )
      // console.log(grouped)
      let res = countBy(ids)
      // console.log(res)

      for (let [k, v] of Object.entries(res)) {
        let comment = find(comments, ['res_no', k])
        if (comment === undefined) continue
        // console.log(comment)
        comment.res_count = v
      }

      // to trigger reactivity
      comments = comments
      grouped_anka = grouped

      // console.log(reses)
      // reses = groupBy(reses, 'innerHTML')
      // console.log(reses)
    }
  }

  let show_reply = false
  let replies = []
  let reply_div = undefined

  function getOffset( el ) {
    let _x = 0;
    let _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  // handle show reply
  function showReply(e) {
    let cid = e.target.dataset['cid']
    // console.log(cid)
    // console.log(grouped_anka)
    // console.log(map(grouped_anka[cid], 'id'))
    let rep_ids = map(grouped_anka[cid], 'id')
    replies = filter(comments, c => {
      return rep_ids.includes(c.res_no)
    })

    let offsets = getOffset(e.target)
    // console.log(offsets)
    reply_div.style.left = (offsets.left - 44) + 'px'
    reply_div.style.top = (offsets.top - 124) + 'px'

    if (replies[0] !== undefined) show_reply = true
    // console.log(replies)
  }

  // handle show anchor
  function showAnchor(e) {
    // console.log(e.target)
    e.preventDefault()
    let cid = e.target.dataset['resTarget']
    // console.log(cid)

    replies = [find(comments, c => {
      return c.res_no === cid
    })]

    if (replies[0] !== undefined) {
      show_reply = true
      reply_div.classList.add('invisible')

      let offsets = getOffset(e.target)
      // console.log(replies)
      // console.log(offsets)

      setTimeout(()=>{
        // console.log(reply_div.clientHeight)
        reply_div.style.left = (offsets.left - 29) + 'px'
        reply_div.style.top = (offsets.top - reply_div.clientHeight - 164) + 'px'
        reply_div.classList.remove('invisible')
      }, 100)
    }
  }
</script>

<div class="relative">
  {#if comments !== undefined}
    <div bind:this={comments_div} class="comments">
      {#each comments as comment}
        <Comment comment={comment} handleImageClick={handleImageClick}
                 insertRes={insertRes}
                 showReply={showReply}
                 showAnchor={showAnchor} />
      {/each}
    </div>
  {/if}

  <div bind:this={reply_div} class="absolute">
    {#if show_reply}
      <OutClick on:outclick={() => {show_reply = false}}>
        <div in:classes="{{
               duration: 300,
               base: 'ease-out duration-300',
               from: 'opacity-0',
               to: 'opacity-100',
             }}"
             out:classes="{{
               duration: 200,
               base: 'ease-in duration-200',
               from: 'opacity-100',
               to: 'opacity-0',
             }}"
             class="transition-opacity bg-base-100/30 p-4 glass">
          <div class="flex justify-between mb-1">
            <button on:click={() => {show_reply = false}} class="btn btn-xs btn-secondary">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="bg-base-200 py-1">
            {#each replies as comment}
              <Comment comment={comment} handleImageClick={handleImageClick}
                       showReply={showReply}
                       showAnchor={showAnchor} />
            {/each}
          </div>
        </div>
      </OutClick>
    {/if}
  </div>

  {#if show_photo}
    <div class="relative z-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!--
        Background backdrop, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div in:classes="{{
          duration: 300,
          base: 'ease-out duration-300',
          from: 'opacity-0',
          to: 'opacity-100',
        }}"
           out:classes="{{
          duration: 200,
          base: 'ease-in duration-200',
          from: 'opacity-100',
          to: 'opacity-0',
        }}"
           class="fixed z-40 inset-0 bg-gray-400 bg-opacity-75 backdrop-filter backdrop-blur transition-opacity"></div>

      <div class="fixed z-50 flex inset-0 overflow-y-auto">
        <div class="flex items-center w-full justify-center place-self-center p-4 text-center sm:p-12">
          <!--
            Modal panel, show/hide based on modal state.

            Entering: "ease-out duration-300"
              From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100 translate-y-0 sm:scale-100"
              To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          -->
          <OutClick on:outclick={togglePhoto}>
            <div in:classes="{{
              duration: 300,
              base: 'ease-out duration-300',
              from: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
              to: 'opacity-100 translate-y-0 sm:scale-100',
            }}"
                 out:classes="{{
              duration: 200,
              base: 'ease-in duration-200',
              from: 'opacity-100 translate-y-0 sm:scale-100',
              to: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
            }}"
                 class="relative bg-black drop-shadow-lg rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
              <div>
                <img class="h-full w-full object-cover m-0 p-0" src="{img_src}" alt="イメージ">
              </div>
            </div>
          </OutClick>
        </div>
      </div>
    </div>
  {/if}
</div>