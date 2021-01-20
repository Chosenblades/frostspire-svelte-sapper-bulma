<script context="module">
	export async function preload( page, session ) {

        if(session && session.token) {
            this.error(400, "Can't forget password while logged in.");
        }
        
	}
</script>

<script>

    let email = "";
    let stage = 1;
    let errorMessage = "";
    let showErrorMessage = false;

    async function forgotPassword() {
        showErrorMessage = false;

        const req = await fetch('http://localhost:5000/api/auth/forgotpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email
            })
            });
        const res = await req.json();

        if(res.success === true) {
           stage = 2;
        } else {
            errorMessage = res.error;
            showErrorMessage = true;
        }
    }

</script>

<style>
.icon {
    display: flex;
    justify-content: center;
    align-items: center;
}

.message-body {
    padding-bottom: 5px;
}
</style>

<svelte:head>
	<title>Forgot Password</title>
</svelte:head>

<!-- svelte-ignore a11y-missing-attribute -->
<section class="section">
    <div class="column is-8 is-offset-2">
        <div class="columns is-desktop">
            <div class="column is-one-third is-offset-one-third">
                <article class="message is-primary is-medium">
                <div class="message-header has-text-centered">
                    <p>Forgot Password</p>
                </div>
                <div class="message-body">
                    {#if stage === 1}
                        <!-- Email -->
                        <div class="field">
                            <div class="control has-icons-left">
                                <input bind:value={email} class="input" type="text" placeholder="Email">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                </span>
                            </div>
                            <p class:is-hidden={!showErrorMessage} contenteditable="true" bind:innerHTML={errorMessage} class="help is-danger">This username is available</p>
                        </div>

                        <!-- Submit -->
                        <div class="has-text-centered">
                            <button on:click={forgotPassword} class="button is-fullwidth is-primary">Request password reset</button>
                        </div>
                    {:else if stage === 2}
                        <p>An email has been sent to <span class="has-text-primary">{email}</span> with a link to reset your password.</p>
                    {/if}
            </article>
            </div>
        </div>
    </div>
</section>