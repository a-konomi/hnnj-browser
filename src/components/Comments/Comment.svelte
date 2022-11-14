<script context="module">
  let image_types = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

  const isOverflown = ({ clientWidth, clientHeight, scrollWidth, scrollHeight }) => {
    return scrollHeight > clientHeight || scrollWidth > clientWidth;
  }
</script>

<script>
  import { onMount } from 'svelte';

  export let comment
  export let handleImageClick
  export let showReply
  export let showAnchor
  export let insertRes = undefined

  let body = undefined
  let is_overflow = false
  let is_open = false

  $: exp_label = (is_open) ? '全体表示中' : '一部表示中'

  function toggleExpand(e) {
    is_open = !is_open

    if (is_open) {
      body.classList.remove('max-h-64', 'overflow-hidden', 'expand_hint')
    } else {
      body.classList.add('max-h-64', 'overflow-hidden', 'expand_hint')
    }
  }

  let images = []
  let has_image = false

  $: {
    if (comment && body) {
      body.querySelectorAll('a.anka').forEach((e) => {
        e.addEventListener('mouseover', showAnchor)
        e.addEventListener('click', showAnchor)
      })
    }
  }

  onMount(()=>{
    is_overflow = isOverflown(body)

    body.innerHTML = body.innerHTML.replace(/ttp|http/g, 'http')
    body.querySelectorAll('a').forEach((e) => {
      let target = e.innerHTML.replace(/&gt;/g, '')
      e.href = '#' + target
      e.target = '_self'
      e.classList.add('anka', 'underline', 'text-primary')
      e.dataset.resNum = comment.res_no
      e.dataset.resTarget = target
      // e.addEventListener('click', showAnchor)
    })

    // match url
    // /http.?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g
    // /(http.?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g
    body.innerHTML = body.innerHTML.replace(/(http.?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+)/g, (match, url) => {
      let is_img = image_types.some(itype => url.includes(itype))
      let klass = (is_img) ? 'cmt-image' : 'cmt-link'

      return '<a href="' + url + '" class="' + klass + '" target="_blank">' + url + '</a>'
    })

    images = Array.from(body.querySelectorAll('.cmt-image')).map(a => a.href)
    // console.log(images)
    has_image = (images.length > 0)
  })
</script>

<div class="mx-4 my-12">
  <div>
    <a id="{comment.res_no}" on:click|preventDefault={insertRes} class="cursor-pointer">{comment.res_no}</a>
    {#if comment.res_count > 0}
      <button data-cid="{comment.res_no}" on:click={showReply} on:mouseover={showReply} class="underline text-secondary">
        &#9166;{comment.res_count}
      </button>
    {/if}
    <span class="text-sm sm:text-base">{comment.name}</span>
    <span class="text-xs sm:text-sm text-base-content/40 block sm:inline">
      {comment.mail} {comment.date} {comment.id}
      {#if is_overflow}
        <button on:click|preventDefault={toggleExpand} class="underline">{exp_label}</button>
      {/if}
    </span>
  </div>

  <div bind:this={body} class="max-h-64 overflow-hidden">
    {@html comment.body}
  </div>

  {#if has_image}
    <div class="px-2 py-6 flex space-x-4">
      {#each images as image}
        <div class="">
          <img src="{image}" on:click|preventDefault={handleImageClick} class="max-h-48 w-48 object-cover rounded-md shadow-md cursor-pointer" alt="イメージ">
        </div>
      {/each}
    </div>
  {/if}
</div>