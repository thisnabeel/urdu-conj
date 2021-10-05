<script>
  import ContactCard from "./ContactCard.svelte";

  let gerund = "";

  $: bones = sanitize(gerund)

  function sanitize(gerund){
    let pieces = gerund.split("na")
    if (pieces.length > 1){
      return pieces.splice(0, pieces.length-2).join('na') + 'na';
    } else {
      return gerund
    }
  }
</script>

<style>
  #form {
    width: 30rem;
    max-width: 100%;
  }

  .masc {
    border-left: 10px solid #93c8ff;
    padding-left: 12px;
  }

  .masc small {
    color: #3278bf;
  }
  
  .fem {
    border-left: 10px solid #ff93a6;
    padding-left: 12px;
  }

  .fem small {
    color: #ff93a6;
  }

</style>

<div id="form">
  <div class="form-control">
    <label for="gerund">Gerund</label>
    <input type="text" bind:value={gerund} id="gerund" placeholder="Gerund" />
     <input type="text" id="trans" placeholder="Translation"  />
  </div>

  <hr>


<article class="masc">
  <small>I'm ____-ing </small>
  <p>Mein <b>{bones}</b>rahaa hun </p>
  <hr>
</article>

<article class="masc">
  <small>He is ____-ing </small>
  <p><u>Woh</u> <b>{bones}</b>rahaa he </p>
  <hr>
</article>

<article class="masc">
  <small>You are ____-ing (informal) </small>
  <p>Tum <b>{bones}</b>rahey ho </p>
  <hr>
</article>


<article class="masc">
  <small>You are ____-ing (formal) </small>
  <p>Aap <b>{bones}</b>rahey hein </p>
  <hr>
</article>


<article class="fem">
  <small>I'm ____-ing (1stp)</small>
  <p>Mein <b>{bones}</b>rahee hun </p>
  <hr>
</article>

<article class="fem">
  <small>She is ____-ing </small>
  <p><u>Woh</u> <b>{bones}</b>rahee he </p>
  <hr>
</article>

<article class="fem">
  <small>You are ____-ing (informal) </small>
  <p>Tum <b>{bones}</b>rahee ho </p>
  <hr>
</article>

<article class="fem">
  <small>You are ____-ing (formal) </small>
  <p>Aap <b>{bones}</b>raheen hein </p>
  <hr>
</article>

<article>
  <small class="neutral">We're ____-ing (neutral)</small>
  <p>Hum <b>{bones}</b>rahey hein </p>
  <hr>
</article>


<article>
  <small>They're ____-ing (they/formal neutral)</small>
  <p><u>Woh</u> <b>{bones}</b>rahey hein </p>
  <hr>
</article>


<article class="masc">
  <small>I will ____ (1stp)</small>
  <p>Mein <b>{bones}</b>unga</p>
  <hr>
</article>

<article class="masc">
  <small>I will ____ (1stp)</small>
  <p><u>Woh</u> <b>{bones}</b>eyga</p>
  <hr>
</article>

<article class="fem">
  <small>I will ____</small>
  <p>Mein <b>{bones}</b>ungi</p>
  <hr>
</article>

<article class="fem">
  <small>She will ____</small>
  <p><u>Woh</u> <b>{bones}</b>eygi</p>
  <hr>
</article>


<article>
  <small>We will ____ (neutral)</small>
  <p>Hum <b>{bones}</b>eingay</p>
  <hr>
</article>

<article>
  <small>They will ____ (they/formal neutral)</small>
  <p><u>Woh</u> <b>{bones}</b>eingay</p>
  <hr>
</article>


<article>
  <small>____! (neutral)</small>
  <p><b>{bones}</b>o!</p>
  <hr>
</article>

<article>
  <small>____! (formal neutral)</small>
  <p><b>{bones}</b>ein!</p>
  <hr>
</article>

<article class="masc">
  <small>Will you ____? (informal)</small>
  <p>Tum <b>{bones}</b>ogay?</p>
  <hr>
</article>

<article class="masc">
  <small>Will you ____? (formal)</small>
  <p>Aap <b>{bones}</b>eingey?</p>
  <hr>
</article>


<article class="fem">
  <small>Will you ____? (formal)</small>
  <p>Tum <b>{bones}</b>ogi?</p>
  <hr>
</article>

<article class="fem">
  <small>Will you ____? (formal)</small>
  <p>Aap <b>{bones}</b>eingee?</p>
  <hr>
</article>

</div>

<br>

