<script>
  import { breed } from '$utils/store';

  function updateBreed(e) {
    $breed = e.target.innerHTML
  }
</script>

<div>
  <div class="menu p-4 overflow-y-auto space-y-4 text-base-content">

    <div>
      <h3 class="text-lg mt-6 mb-2 text-center border-b">テーマ</h3>

      <ul>
        <!-- Sidebar content here -->
        <li><button data-set-theme="dark" data-act-class="border">+✞ ダークネス ✞+</button></li>
        <li><button data-set-theme="light" data-act-class="border">✠ ホーリーホワイト ✠</button></li>
        <li><button data-set-theme="cupcake" data-act-class="border">🍰ケーキ</button></li>
        <li><button data-set-theme="bumblebee" data-act-class="border">バンブルビー</button></li>
        <li><button data-set-theme="synthwave" data-act-class="border">シンセ</button></li>
        <li><button data-set-theme="retro" data-act-class="border">レトロ</button></li>
        <li><button data-set-theme="valentine" data-act-class="border">バレンタイン</button></li>
        <li><button data-set-theme="halloween" data-act-class="border">🎃ハロウィン🎃</button></li>
        <li><button data-set-theme="garden" data-act-class="border">ガーデン</button></li>
        <li><button data-set-theme="forest" data-act-class="border">🌲森</button></li>
        <li><button data-set-theme="aqua" data-act-class="border">💧アクア</button></li>
        <li><button data-set-theme="lofi" data-act-class="border">Lo-fi</button></li>
        <li><button data-set-theme="pastel" data-act-class="border">パステル</button></li>
        <li><button data-set-theme="fantasy" data-act-class="border">ファンタジー</button></li>
        <li><button data-set-theme="wireframe" data-act-class="border">ワイヤフレイム</button></li>
        <li><button data-set-theme="black" data-act-class="border">ブラック</button></li>
        <li><button data-set-theme="luxury" data-act-class="border">✨ゴージャス</button></li>
        <li><button data-set-theme="dracula" data-act-class="border">🧛ドラキュラ</button></li>
        <li><button data-set-theme="cmyk" data-act-class="border">CMYK</button></li>
        <li><button data-set-theme="autumn" data-act-class="border">秋</button></li>
        <li><button data-set-theme="business" data-act-class="border">ビジネス</button></li>
        <li><button data-set-theme="corporate" data-act-class="border">コーポレート</button></li>
        <li><button data-set-theme="acid" data-act-class="border">🐜酸だー</button></li>
        <li><button data-set-theme="lemonade" data-act-class="border">レモネード</button></li>
        <li><button data-set-theme="emerald" data-act-class="border">✪エメラルド✪</button></li>
        <li><button data-set-theme="cyberpunk" data-act-class="border">❀サイバーパンク❀</button></li>
        <li><button data-set-theme="night" data-act-class="border">🌠ナイト</button></li>
        <li><button data-set-theme="coffee" data-act-class="border">☕コーヒー</button></li>
        <li><button data-set-theme="winter" data-act-class="border">❄️ウィンター⛄</button></li>
      </ul>
    </div>

    <div>
      <h3 class="text-lg mt-6 mb-2 text-center border-b">品種 {$breed}</h3>

      <ul>
        <li><button on:click|preventDefault={updateBreed}>(´・ω・`)</button></li>
        <li><button on:click|preventDefault={updateBreed}>(´・ω・｀)</button></li>
        <li><button on:click|preventDefault={updateBreed}>(´･ω･`)</button></li>
        <li><button on:click|preventDefault={updateBreed}>(´･ω･｀)</button></li>
        <li><button on:click|preventDefault={updateBreed}>(´・ω・`)</button></li>
        <li><button on:click|preventDefault={updateBreed}>(　´・ω・｀　)</button></li>
        <li><button on:click|preventDefault={updateBreed}>(´・ω・｀三´・ω・｀)</button></li>
      </ul>
    </div>
  </div>
</div>