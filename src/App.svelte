<script>
  import Swal from 'sweetalert2'
  import QuizModal from "./quizModal.svelte"
  let quiz

  import Words from "./words.svelte"
  let words

  let gerund = "khaa";
  let trans = "eating";
  let questions = []

  let sentences
  

  $: bones = sanitize(gerund)

  function sanitize(gerund){
    // let pieces = gerund.split("na")
    // if (pieces.length > 1){
    //   return pieces.splice(0, pieces.length-2).join('na') + 'na';
    // } else {
    //   return gerund
    // }
    return gerund
  }

  function changeWord(){
    words.randomWord()
  }
  

  let db = new PouchDB('urdu');
  
  let verbs = []


  function addVerb() {
      var verb = {
          _id: new Date().toISOString(),
          verb: gerund,
          trans: trans
      };
      db.put(verb, function callback(err, result) {

        
        words.getVerbs()

          if (!err) {
              console.log('Successfully posted a verb!');
          }
      });
  }

  // 
  let phrases = [
    {
      gender: "masc",
      formality: "informal",
      trans: "I'm ~",
      phrase: "Mein <b>~</b>rahaa hun "
    },
    {
      gender: "fem",
      formality: "informal",
      trans: "I'm ~",
      phrase: "Mein <b>~</b>rahee hun"
    },
    {
      gender: "masc",
      formality: "informal",
      trans: "I will |",
      phrase: "Mein <b>~</b>unga "
    },
    {
      gender: "fem",
      formality: "informal",
      trans: "I will |",
      phrase: "Mein <b>~</b>ungi"
    },
    {
      gender: "masc",
      formality: "informal",
      trans: "I'm done ~",
      phrase: "Mein <b>~</b>liya"
    },
    {
      gender: "fem",
      formality: "informal",
      trans: "I'm done ~",
      phrase: "Mein <b>~</b>lee"
    },
    {
      gender: "masc",
      formality: "informal",
      trans: "He is ~",
      phrase: "Woh <b>~</b>rahaa hay"
    },
    {
      gender: "fem",
      formality: "informal",
      trans: "She is ~",
      phrase: "Woh <b>~</b>rahee hay"
    },
    {
      gender: "neutral",
      formality: "formal",
      trans: "They are ~",
      phrase: "Woh <b>~</b>rahey hein"
    },
    {
      gender: "masc",
      formality: "formal",
      trans: "You are ~",
      phrase: "Aap <b>~</b>rahey hein"
    },
    {
      gender: "fem",
      formality: "formal",
      trans: "You are ~",
      phrase: "Aap <b>~</b>raheen hein"
    },
    {
      gender: "neutral",
      formality: "formal",
      trans: "We are ~",
      phrase: "Hum <b>~</b>rahey hein"
    },
    {
      gender: "neutral",
      formality: "informal",
      trans: "|!",
      phrase: "<b>~</b>o!"
    },
    {
      gender: "neutral",
      formality: "formal",
      trans: "Shall we |?",
      phrase: "<b>~</b>ein?"
    },
  ]

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

  [gender="neutral"] {
    border-left: 10px dashed #000000;
    padding-left: 12px;
  }

</style>

<div id="form">
  <div class="form-control">
    <label for="gerund">Gerund</label>
    <input type="text" bind:value={gerund} id="gerund" placeholder="Gerund" />
    <input type="text" bind:value={trans}  id="trans" placeholder="Translation"  />
    <button class="btn-info" on:click="{addVerb}">+</button>
  </div>

  <hr>
  
  <QuizModal bind:this={quiz} phrases="{phrases}" gerund="{gerund}" trans="{trans}" changeWord={() => changeWord()}></QuizModal>

  <hr>

  <div id="sentences">

    {#each phrases as phrase}
      <article class="{phrase["gender"]}" gender="{phrase["gender"]}" >
        <small>{phrase["trans"].replaceAll("~", trans).replaceAll("|", trans.split("ing")[0])}</small>
        <p>{@html phrase["phrase"].replaceAll("~", gerund)}</p>
        <hr>
      </article>
    {/each}

  </div>

</div>

<br>

<Words verbs={verbs} bind:changeGerund={gerund} bind:changeTrans={trans} bind:updateVerbs={verbs} bind:this={words}></Words>