<script>
    let db = new PouchDB('todos');

    function addVerb(text) {
        var verb = {
            _id: new Date().toISOString(),
            verb: text,
        };
        db.put(verb, function callback(err, result) {
            if (!err) {
                console.log('Successfully posted a verb!');
            }
        });
    }

    let verbs = []

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
    console.log(verbs)

</script>

<style>
    ul {
        position: fixed;
        right: 0;
        bottom: 0;
        padding: 30px;
        background: #f0f8ff;
    }
</style>

<ul>
    {#each verbs as verb}
        <li>{verb["doc"]["verb"]}</li>
    {/each}
</ul>

