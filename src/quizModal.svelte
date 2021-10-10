<script>
    import Modal from "sv-bootstrap-modal";
    let isOpen = false;

    export let gerund
    export let trans


    let questions = []
    let randomQuestion = ""
    let correct = 0
    let incorrect = 0
    let showColors = false

    function openQuiz(){
        isOpen = !isOpen
        correct = 0
        incorrect = 0
        randomizer()

    }

    function randomizer(){
        questions = []
        showColors = false
        document.querySelectorAll('article').forEach((el, index) => {
            //do stuff with _el here
            let answer = el.querySelector("small").innerHTML
            questions.push({
                question: el.querySelector("p").innerHTML,
                answer: answer,
                test: [randomAnswer(), randomAnswer(), answer]
            })
        })
        console.log(questions)
        randomQuestion = questions[Math.floor(Math.random()*questions.length)];
    }

    function randomAnswer(){
        let randomArticles = document.querySelectorAll('article')
        return randomArticles[Math.floor(Math.random()*randomArticles.length)].querySelector("small").innerHTML;
    }

    function checkAnswer(q, a){
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
    .green {
        background-color:#9aff9a;
    }

    .red {
        background-color: #ffb0b0;
    }

    .green, .red {
        padding: 20px;
    }

    .hide-answers .green, 
    .hide-answers .red {
        background-color: transparent;
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
        {@html randomQuestion["question"]}
        <hr>
        <ul class="{!showColors ? 'hide-answers': ''}">
            {#each shuffle(randomQuestion["test"]) as q}
                <li on:click="{checkAnswer(q, randomQuestion["answer"])}" 
                    class="{q === randomQuestion["answer"] ? 'green': 'red'}">{@html q}</li>
            {/each}
        </ul>
    </div>

    <hr>
    <p>Correct: {correct}</p>
    <p>Incorrect: {incorrect}</p>
    <div class="modal-footer">
        <button type="button" on:click="{randomizer}" class="btn btn-primary">Refresh</button>
    </div>
</Modal>
 
<button class="btn btn-block btn-primary" on:click={openQuiz}>Quiz</button>
