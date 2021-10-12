<script>
    import Modal from "sv-bootstrap-modal";
    let isOpen = false;

    export let gerund
    export let trans
    export let phrases

    let questions = []
    let correct = 0
    let incorrect = 0
    let showColors = false

    function openQuiz(){
        isOpen = !isOpen
        correct = 0
        incorrect = 0
        randomizer()

    }


    export let changeWord = () => {}

    $: phrase = phrases[Math.floor(Math.random()*phrases.length)]
    $: quiz = {
        phrase: phrase["phrase"].replaceAll("~", gerund),
        answer: convertedTrans(phrase),
        choices: [
            phrase,
            randomChoice(),
            randomChoice()
        ]
    }
    

    function convertedTrans(input){
        return `${getFormalityEmoji(input["formality"])} ${getGenderEmoji(input["gender"])} ${input["trans"].replaceAll("~", trans).replaceAll("|", trans.split("ing")[0])}`
    }

    function getFormalityEmoji(input){
        if (input == "informal"){
            return "🧢"
        } else if (input == "formal") {
            return "🎩"
        } else {
            return ""
        }
    }

    function getGenderEmoji(input){
        if (input == "masc"){
            return "🧔"
        } else if (input == "fem") {
            return "👱‍♀️"
        } else {
            return ""
        }
    }

    function randomizer(){
        showColors = false
        changeWord()
    }

    function randomChoice(){
        let choice = phrases[Math.floor(Math.random()*phrases.length)]
        return choice
    }

    function checkAnswer(q, a){
        console.log(q, a)
        if (q == a) {
            correct += 1
        } else {
            incorrect += 1
        }
        showColors = true
        setTimeout(randomizer, 1500);
    }

    function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
    }
</script> 

<style>
    ul {
        list-style: none;
    }

    ul li {
        margin-bottom: 10px;
    }
    .green {
        background-color:#9aff9a;
    }

    .red {
        background-color: #ed3838;
        /* border: 6px dashed #ed3838; */
    }

    .green, .red {
        padding: 20px;
    }

    .hide-answers .green, 
    .hide-answers .red {
        background-color: transparent;
    }

    [gender="masc"] {
        color: #2b87ff;
        border-left: 16px solid #2b87ff;
    }

    [gender="fem"] {
        color: #ff2b50;
        border-left: 16px solid #ff93a6;
    }

    [gender="neutral"] {
        border-left: 16px dashed #000000;
        padding-left: 12px;
    }

    #results {
        padding: 30px;
    }
</style>
 
<Modal bind:open={isOpen}>
    <div class="modal-header">
    <h5 class="modal-title">{gerund}-na = {trans}</h5>
        <button type="button" class="close" on:click={() => (isOpen = false)}>
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        {@html quiz["phrase"]}
        <hr>
        <ul class="{!showColors ? 'hide-answers': ''}">
            {#each shuffle(quiz["choices"]) as choice}
                <li on:click="{checkAnswer(quiz["answer"], convertedTrans(choice))}" 
                    class="{quiz["answer"] === convertedTrans(choice) ? 'green': 'red'}"
                    gender="{choice["gender"]}"
                    >{@html convertedTrans(choice)}</li>
            {/each}
        </ul>
    </div>

    <hr>
    <section id="results">
        <p>Correct: {correct}</p>
        <p>Incorrect: {incorrect}</p>
    </section>
        <div class="modal-footer">
            <button type="button" on:click="{randomizer}" class="btn btn-primary">Refresh</button>
        </div>
</Modal>
 
<button class="btn btn-block btn-primary" on:click={openQuiz}>Quiz</button>
