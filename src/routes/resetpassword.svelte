<script context="module">
	export async function preload( page, session ) {

        if(session && session.token) {
            this.error(400, "Can't reset password while logged in. ");
        }

        if(page.query.token) {
            const resetToken = page.query.token;
            console.log(resetToken);
            return { resetToken };
        } else {
            this.error(400, 'No reset token supplied.');
        }
        
	}
</script>

<script>

    import { goto } from '@sapper/app'

    export let resetToken;
    let password = "";
    let password2 = "";
    let stage = 1;
    let errorMessage = "";
    let showErrorMessage = false;

    async function updatePassword() {
        showErrorMessage = false;

        if(password !== password2) {
            errorMessage = "Passwords don't match.";
            showErrorMessage = true;
        }

        const req = await fetch(`http://localhost:5000/api/auth/resetpassword/${resetToken}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password
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
	<title>Reset Password</title>
</svelte:head>

<!-- svelte-ignore a11y-missing-attribute -->
<section class="section">
    <div class="column is-8 is-offset-2">
        <div class="columns is-desktop">
            <div class="column is-one-third is-offset-one-third">
                <article class="message is-primary is-medium">
                <div class="message-header has-text-centered">
                    <p>Reset Password</p>
                </div>
                <div class="message-body">
                    {#if stage === 1}
                    <!-- Username -->
                    <div class="field">
                        <div class="control has-icons-left">
                            <input bind:value={password} class="input" type="text" placeholder="New password">
                            <span class="icon is-small is-left">
                                <i class="fas fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="field">
                        <p class="control has-icons-left">
                            <input bind:value={password2} class="input" type="password" placeholder="Verify your new password">
                            <span class="icon is-small is-left">
                                <i class="fas fa-lock"></i>
                            </span>
                        </p>
                        <p class:is-hidden={!showErrorMessage} contenteditable="true" bind:innerHTML={errorMessage} class="help is-danger">This username is available</p>
                    </div>

                    <!-- Submit -->
                    <div class="has-text-centered">
                        <button on:click={updatePassword} class="button is-fullwidth is-primary">Change password</button>
                    </div>

                    {:else if stage === 2}
                        <p>Your password has been reset.</p>
                    {/if}

            </article>
            </div>
        </div>
    </div>
</section>