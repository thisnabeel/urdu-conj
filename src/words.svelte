<script>

    export let verbs 

    export let changeGerund
    export let changeTrans
    export let updateVerbs

    function populateMain(gerund, trans){
        changeGerund = gerund
        changeTrans = trans
    }

    export function getVerbs(){
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

    export function randomWord(){
        let verb = verbs[Math.floor(Math.random()*verbs.length)];
        console.log(verb)
        populateMain(
            verb["doc"]["verb"], 
            verb["doc"]["trans"]
        )

    }

    function removeWord(id){
        db.get(id).then(function(doc) {
            return db.remove(doc);
        }).then(function (result) {
            // handle result
            getVerbs()
        }).catch(function (err) {
            console.log(err);
        });
    }
    

</script>

<style>
    ul {
        position: fixed;
        right: 0;
        bottom: 0;
        padding: 0;
        background: #f0f8ff;
        list-style: none;
    }

    ul li {
        padding: 10px;
        background: #e5f3ff;
        margin: 16px;
        position: relative;
    }

    li span {
        position: absolute;
        left: -20px;
    }
</style>

<ul id="words">
    {#each verbs as verb}
        <li on:click={populateMain(verb["doc"]["verb"], verb["doc"]["trans"])} gerund={verb["doc"]["verb"]} trans={verb["doc"]["trans"]}>
            <span on:click={removeWord(verb["doc"]["_id"])}>x</span>
            {verb["doc"]["verb"]}</li>
    {/each}
</ul>

