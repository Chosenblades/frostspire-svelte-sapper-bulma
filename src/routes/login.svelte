<script>

    import { goto, stores } from '@sapper/app'
    const { session } = stores()

    let username = "";
    let password = "";
    let errorMessage = "asdf";
    let showErrorMessage = false;

    async function loginUser() {
        errorMessage = "";

        const req = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
            });
        const res = await req.json();

        if(res.success === true) {
            let token = res.token;
            console.log(token);
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
	<title>Login</title>
</svelte:head>

<!-- svelte-ignore a11y-missing-attribute -->
<section class="section">
    <div class="column is-8 is-offset-2">
        <div class="columns is-desktop">
            <div class="column is-one-third is-offset-one-third">
                <article class="message is-primary is-medium">
                <div class="message-header has-text-centered">
                    <p>Login</p>
                </div>
                <div class="message-body">
                    <!-- Username -->
                    <div class="field">
                        <div class="control has-icons-left">
                            <input bind:value={username} class="input" type="text" placeholder="Username">
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                        </div>
                        
                    </div>

                    <!-- Password -->
                    <div class="field">
                        <p class="control has-icons-left">
                            <input bind:value={password} class="input" type="password" placeholder="Password">
                            <span class="icon is-small is-left">
                                <i class="fas fa-lock"></i>
                            </span>
                        </p>
                        <p class:is-hidden={!showErrorMessage} contenteditable="true" bind:innerHTML={errorMessage} class="help is-danger">This username is available</p>
                    </div>

                    <!-- Submit -->
                    <div class="has-text-centered">
                        <button on:click={loginUser} class="button is-medium is-fullwidth is-primary">Login</button>
                    </div>

                    <div class="has-text-weight-light has-text-centered is-size-5">
                        <p class="is-size-6" style="padding-top: 10px;">Not registered? <a style="text-decoration:none; color:#039be5;" href="register">Create an account</a></p>
                        <p class="is-size-6">Forgot your password? <a style="text-decoration:none; color:#039be5;" href="forgotpassword">Reset password</a></p>
                    </div>
            </article>
            </div>
        </div>
    </div>
</section>