<script>

    export let verbs 

    export let changeGerund
    export let changeTrans

    function populateMain(gerund, trans){
        changeGerund = gerund
        changeTrans = trans
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
    }
</style>

<ul>
    {#each verbs as verb}
    <li on:click={populateMain(verb["doc"]["verb"], verb["doc"]["trans"])} gerund={verb["doc"]["verb"]} trans={verb["doc"]["trans"]}>{verb["doc"]["verb"]}</li>
    {/each}
</ul>

