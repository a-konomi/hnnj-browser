<script>
  import { latest_id } from '../utils/store';
  import { Jumper } from 'svelte-loading-spinners'

  let cover = String(Math.floor(Math.random() * 11) + 1).padStart(2, '0')
</script>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col lg:flex-row">
    <div class="max-w-sm sm:max-w-wd max-h-64 sm:max-h-full mt-[64px] sm:mt-0">
      <img class="object-cover rounded-lg shadow-2xl" src="https://d2fda0vykczvmk.cloudfront.net/images/placers/wcovers/x360-{cover}.jpg" alt="ヒーロー" />
    </div>
    <div class="sm:ml-6 text-center sm:text-left">
      <h1 class="text-5xl font-bold">XBOX<br>総合スレ避難所</h1>
      <div class="divider">専用ブラウザー</div>
      <div class="py-6">
        <p class="">ベータ・バグあり・利用は自己責任</p>
        <p class="">転載禁止</p>
      </div>
      {#if $latest_id !== ''}
        <a href="/thread/{$latest_id}" class="btn btn-primary lowercase">新鮮なスレ(´・ω・｀三´・ω・｀)</a>
      {:else}
        <div class="flex justify-center items-center text-sm">
          ロードできねぇ。<br>したらば死んだ?(´・ω・｀)
          <Jumper color="#0e7a0d" />
        </div>
      {/if}
    </div>
  </div>
</div>
