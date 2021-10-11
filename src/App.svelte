<script>
  import ContactCard from "./ContactCard.svelte";
  import Swal from 'sweetalert2'
  import QuizModal from "./quizModal.svelte"
  import Words from "./words.svelte"

  let gerund = "khaa";
  let trans = "eating";
  let questions = []

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

  let db = new PouchDB('urdu');
  
  let verbs = []
  
  function getVerbs(){
        db.allDocs({
            include_docs: true,
            attachments: true
        }).then(function (result) {
        // handle result
            console.log(result)
            verbs = result["rows"]
        }).catch(function (err) {
            console.log(err);
        });
  }
  getVerbs()

  function addVerb() {
      var verb = {
          _id: new Date().toISOString(),
          verb: gerund,
          trans: trans
      };
      db.put(verb, function callback(err, result) {

        
        getVerbs()

          if (!err) {
              console.log('Successfully posted a verb!');
          }
      });
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
  <QuizModal gerund="{gerund}" trans="{trans}"></QuizModal>

  <hr>

<article class="masc" gender="masc">
  <small>I'm {trans}</small>
  <p>Mein <b>{bones}</b>rahaa hun </p>
  <hr>
</article>

<article class="masc" gender="masc">
  <small>He is  {trans} 🧢</small>
  <p><u>Woh</u> <b>{bones}</b>rahaa he </p>
  <hr>
</article>

<article class="masc" gender="masc">
  <small>You are {trans} 🧢 </small>
  <p>Tum <b>{bones}</b>rahey ho </p>
  <hr>
</article>


<article class="masc" gender="masc">
  <small>You are {trans} 🎩 </small>
  <p>Aap <b>{bones}</b>rahey hein </p>
  <hr>
</article>


<article class="fem" gender="fem">
  <small>I'm {trans}</small>
  <p>Mein <b>{bones}</b>rahee hun </p>
  <hr>
</article>

<article class="fem" gender="fem">
  <small>She is {trans} 🧢</small>
  <p><u>Woh</u> <b>{bones}</b>rahee he </p>
  <hr>
</article>

<article class="fem" gender="fem">
  <small>You are {trans} 🧢 </small>
  <p>Tum <b>{bones}</b>rahee ho </p>
  <hr>
</article>

<article class="fem" gender="fem">
  <small>You are {trans} 🎩 </small>
  <p>Aap <b>{bones}</b>raheen hein </p>
  <hr>
</article>

<article gender="neutral">
  <small>We're {trans}</small>
  <p>Hum <b>{bones}</b>rahey hein </p>
  <hr>
</article>


<article gender="neutral">
  <small>They're {trans} (they/formal)</small>
  <p><u>Woh</u> <b>{bones}</b>rahey hein </p>
  <hr>
</article>


<article class="masc" gender="masc">
  <small>I will {trans.split("ing")[0]}</small>
  <p>Mein <b>{bones}</b>unga</p>
  <hr>
</article>

<article class="masc" gender="masc">
  <small>He will {trans.split("ing")[0]}</small>
  <p><u>Woh</u> <b>{bones}</b>eyga</p>
  <hr>
</article>

<article class="fem" gender="fem">
  <small>I will {trans.split("ing")[0]}</small>
  <p>Mein <b>{bones}</b>ungi</p>
  <hr>
</article>

<article class="fem" gender="fem">
  <small>She will {trans.split("ing")[0]}</small>
  <p><u>Woh</u> <b>{bones}</b>eygi</p>
  <hr>
</article>


<article gender="neutral">
  <small>We will {trans.split("ing")[0]}</small>
  <p>Hum <b>{bones}</b>eingay</p>
  <hr>
</article>

<article gender="neutral">
  <small>They/He will {trans.split("ing")[0]} (they/🎩)</small>
  <p><u>Woh</u> <b>{bones}</b>eingay</p>
  <hr>
</article>


<article gender="neutral">
  <small>{trans.split("ing")[0]}! 🧢</small>
  <p><b>{bones}</b>o!</p>
  <hr>
</article>

<article gender="neutral">
  <small>Please {trans.split("ing")[0]}! 🧢</small>
  <p><b>{bones}</b>ein!</p>
  <hr>
</article>

<article gender="neutral">
  <small>{trans.split("ing")[0]}! 🎩</small>
  <p><b>{bones}</b>ein!</p>
  <hr>
</article>

<article gender="neutral">
  <small>Please {trans.split("ing")[0]}! 🎩</small>
  <p><b>{bones}</b>ein!</p>
  <hr>
</article>

<article class="masc" gender="masc">
  <small>Will you {trans.split("ing")[0]}? 🧢</small>
  <p>Tum <b>{bones}</b>ogay?</p>
  <hr>
</article>

<article class="masc" gender="masc">
  <small>Will you {trans.split("ing")[0]}? 🎩</small>
  <p>Aap <b>{bones}</b>eingey?</p>
  <hr>
</article>


<article class="fem" gender="fem">
  <small>Will you {trans.split("ing")[0]}? 🧢</small>
  <p>Tum <b>{bones}</b>ogi?</p>
  <hr>
</article>

<article class="fem" gender="fem">
  <small>Will you {trans.split("ing")[0]}? 🎩</small>
  <p>Aap <b>{bones}</b>eingee?</p>
  <hr>
</article>

</div>

<br>

<Words verbs={verbs} bind:changeGerund={gerund} bind:changeTrans={trans}></Words>