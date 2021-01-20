<script context="module">
	export async function preload( page, session ) {

        if(!session || !session.token) {
            console.log("Not logged in!")
            this.redirect(302, 'login');
        }
        
	}
</script>

<script>
    import { goto, stores } from '@sapper/app'
    import { skills } from '../utility/skills';
    import { formatNumber } from '../utility/utility';
    import { fetchHandler } from '../utility/fetchHandler';
    import axios from 'axios';

    const { session } = stores()

    let userPromise = loadUser();
    
    //fetch user information
    async function loadUser() {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/me', {}, {
                //method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+$session.token
                }
                });

            if(res.data.success === true) {
                return res.data.data;
            } else {
                throw "Error occured.";
            }
        } catch(err) {
            console.log(err);
        }
    }
</script>

<style>
.icon {
    display: flex;
    justify-content: right;
    align-items: right;
}

.message-body {
    padding-bottom: 5px;
}
</style>

<svelte:head>
	<title>Account</title>
</svelte:head>

<!-- svelte-ignore a11y-missing-attribute -->
<section class="section">
    <div class="column is-8 is-offset-2">
        <div class="columns is-desktop">
            <div class="column is-one-third">
                <article class="message is-primary is-medium">
                    <div class="message-header has-text-centered">
                        <p>Account Information</p>
                    </div>
                    <div class="message-body">
                        {#await userPromise}
                            <p>Loading...</p>
                        {:then user}
                            <ul>
                                <li><i class="fas fa-envelope"></i> {user.email}</li>
                                <li><i class="fas fa-user"></i> {user.username}</li>
                                <li><i class="fas fa-calendar"></i> Member since: {new Date(user.createdAt).toDateString()}</li>
                            </ul>
                            <h2><a>Edit account information</a></h2>
                        {:catch error}
                            <p>Something went wrong.</p>
                        {/await}
                    </div>
                </article>
            </div>

            <div class="column is-two-thirds">
                <article class="message is-primary is-medium">
                    <div class="message-header has-text-centered">
                        <p>Stats</p>
                    </div>
                    <div class="message-body">
                        <table class="table is-hoverable is-fullwidth">
                            <thead>
                                <tr>
                                    <th>Skill</th>
                                    <th>Level</th>
                                    <th>XP</th>
                                </tr>
                            </thead>

                            <tbody>
                                {#await userPromise}
                                    <p>Loading stats...</p>
                                {:then user}
                                    {#each skills as skill, i}
                                        <tr>
                                            {#if i == 0}
                                            <!-- do nothing because we don't have total lvl/exp -->
                                            {:else}
                                                <td><img class="skillicon" src="img/skillicons/{skill}.png"></td>
                                                <td>{user.skills[i-1].lvl}</td>
                                                <td>{formatNumber(user.skills[i-1].xp)}</td>
                                            {/if}
                                        </tr>
                                    {:else}
                                        <p class="text-is-danger">Error loading data.</p>
                                    {/each}
                                {:catch error}
                                    <p>Something went wrong.</p>
                                {/await}
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>
        </div>
    </div>
</section>