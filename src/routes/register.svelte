<script>
    import { goto, stores } from '@sapper/app'
    import { fade, fly } from 'svelte/transition';

    const { preloading, page, session } = stores()

    let email = "";
    let username = "";
    let password = "";

    let emailErrorMessage = "";
    let usernameErrorMessage = "";
    let passwordErrorMessage = "";
    let otherErrorMessage = "";

    let showEmailError = false;
    let showUsernameError = false;
    let showPasswordError = false;
    let showOtherError = false;

    async function registerUser() {
        resetErrorMessages();

        const req = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                username,
                password
            })
            });
        const res = await req.json();

        if(res.success === true) {
            let token = res.token;
            $session.token = token;
            const setsession = await fetch('/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token })
            });
            goto('/');
        } else {
            if(res.error.includes(",")) {
                const errors = res.error.split(",");

                errors.forEach(error => assignError(error));
            } else {
                assignError(res.error);
            }

            showOrHideErrors();
        }
    }

    function showOrHideErrors() {
        if(emailErrorMessage.length > 0) {
            showEmailError = true;
        } else {
            showEmailError = false;
        }

        if(usernameErrorMessage.length > 0) {
            showUsernameError = true;
        } else {
            showUsernameError = false;
        }

        if(passwordErrorMessage.length > 0) {
            showPasswordError = true;
        } else {
            showPasswordError = false;
        }

        if(otherErrorMessage.length > 0) {
            showOtherError = true;
        } else {
            showOtherError = false;
        }
    }

    function resetErrorMessages() {
        emailErrorMessage = "";
        usernameErrorMessage = "";
        passwordErrorMessage = "";
        otherErrorMessage = "";
    }

    function assignError(error) {
        if(error.toLowerCase().includes("email")) {
            emailErrorMessage += error;
        } else if(error.toLowerCase().includes("username")) {
            usernameErrorMessage += error;
        } else if(error.toLowerCase().includes("password")) {
            passwordErrorMessage += error;
        } else {
            otherErrorMessage += error;
        }
    }

</script>

<style>
.icon {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<svelte:head>
	<title>Register</title>
</svelte:head>

<!-- svelte-ignore a11y-missing-attribute -->
<section class="section">
    <div class="column is-8 is-offset-2">
        <div class="columns is-desktop">
            <div class="column is-one-third is-offset-one-third">
                <article class="message is-primary is-medium">
                <div class="message-header has-text-centered">
                    <p>Register</p>
                </div>
                <div class="message-body">
                    <!-- Email -->
                    <div class="field">
                        <div class="control has-icons-left">
                            <input bind:value={email} class="input" type="email" placeholder="Email" id="email">
                            <span class="icon is-small is-left">
                                <i class="fas fa-envelope"></i>
                            </span>
                        </div>
                        {#if showEmailError}
                            <p class="help is-danger">{emailErrorMessage}</p>
                        {/if}
                    </div>

                    <!-- Username -->
                    <div class="field">
                        <div class="control has-icons-left">
                            <input bind:value={username} class="input" type="text" placeholder="Username" id="username">
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                        </div>
                        {#if showUsernameError}
                            <p class="help is-danger">{usernameErrorMessage}</p>
                        {/if}
                    </div>

                    <!-- Password -->
                    <div class="field">
                        <p class="control has-icons-left">
                            <input bind:value={password} class="input" type="password" placeholder="Password" id="password">
                            <span class="icon is-small is-left">
                                <i class="fas fa-lock"></i>
                            </span>
                        </p>
                        {#if showPasswordError}
                            <p class="help is-danger">{passwordErrorMessage}</p>
                        {/if}
                    </div>

                    {#if showOtherError}
                        <p class="help is-danger">{otherErrorMessage}</p>
                    {/if}

                    <!-- Submit -->
                    <div class="has-text-centered">
                        <button on:click={registerUser} class="button is-medium is-fullwidth is-primary">Register</button>
                    </div>
            </article>
            </div>
        </div>
    </div>
</section>