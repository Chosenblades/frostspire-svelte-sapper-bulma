<script>
import { createEventDispatcher } from 'svelte';
import { validateInput } from '../../utility/utility';
import { fetchHandler } from '../../utility/fetchHandler';

const dispatch = createEventDispatcher();
let showFirstErrorMessage = false;
let firstErrorMessage = "Error message.";
let showSecondErrorMessage = false;
let secondErrorMessage = "Error message.";

async function comparePlayers() {
    showFirstErrorMessage = false;
    showSecondErrorMessage = false;
    var user1 = document.getElementById('compareplayer1').value;
    var user2 = document.getElementById('compareplayer2').value;

    if(!validateInput(user1)) {
        firstErrorMessage = "Please enter a name.";
        showFirstErrorMessage = true;
        return;
    }

    if(!validateInput(user2)) {
        secondErrorMessage = "Please enter a name.";
        showSecondErrorMessage = true;
        return;
    }

    const res = await fetchHandler(`http://localhost:5000/api/highscores/${user1}`);
    
    if (res.success !== true) {
        firstErrorMessage = res.error;
        showFirstErrorMessage = true;
        return;
    }

    let firstPlayer = res.data;

    const res2 = await fetchHandler(`http://localhost:5000/api/highscores/${user2}`);

    if (res2.success !== true) {
        secondErrorMessage = res2.error;
        showSecondErrorMessage = true;
        return;
    }

    let secondPlayer = res2.data;


    dispatch('comparePlayers', 
        {
            firstPlayer,
            secondPlayer
        });
}
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<article class="message is-primary">
    <div class="message-header">
        <p>Compare players</p>
    </div>
    <div class="message-body">
        <div class="field">
            <div class="control is-expanded">
                <input class="input" type="text" placeholder="Username" id="compareplayer1">
            </div>
        </div>

        {#if showFirstErrorMessage}
            <div class="has-text-danger has-text-centered">
                <p>{firstErrorMessage}</p>
                <br>
            </div>
        {/if}

        <div class="field has-addons">
            <div class="control is-expanded">
                <input class="input" type="text" placeholder="Username" id="compareplayer2">
            </div>
            <div class="control">
                <a on:click={comparePlayers} class="button is-info">
                Compare
                </a>
            </div>
        </div>

        {#if showSecondErrorMessage}
            <div class="has-text-danger has-text-centered">
                <p>{secondErrorMessage}</p>
                <br>
            </div>
        {/if}
    </div>
</article>