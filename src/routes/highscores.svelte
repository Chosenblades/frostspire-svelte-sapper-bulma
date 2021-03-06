<script context="module">
	export async function preload(page, session) {

		const res = await this.fetch('http://localhost:5000/api/highscores', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
                });
        const data = await res.json();

		if (res.status === 200) {
            const players = data.data;
			return { players };
		} else {
            this.error(res.status, data.error);
        }
	}
</script>

<script>
    import { fade, fly } from 'svelte/transition';
    import HighscoresTable from '../components/highscores/HighscoresTable.svelte';
    import HighscoresSearch from '../components/highscores/HighscoresSearch.svelte';
    import HighscoresCompare from '../components/highscores/HighscoresCompare.svelte';
    import HighscoresSkillIcons from '../components/highscores/HighscoresSkillIcons.svelte';
    import HighscoresSearchModal from '../components/highscores/HighscoresSearchModal.svelte';
    import HighscoresCompareModal from '../components/highscores/HighscoresCompareModal.svelte';
    import { skills } from '../utility/skills';

    //Holds the data that is displayed on main table
    //Initialize players with dummy data to prevent errors during development.
    export let players = [{username: "John Doe", totalLevel: "69", totalExperience: "420420420"}];

    //Hold the data is currently being displayed for a specific player. Used for click player, search player
    let currentPlayer;

    //Used for comparing players
    let firstPlayer;
    let secondPlayer;

    //What skill the main table is sorted by
    let currentSkill = "Overall";

    //What page the maintable is showing up to
    let page = 1;

    //Show modal containing data for searched/compared players
    let showSearchModal = false;
    let showCompareModal = false;

    //Clicked player on main table, open modal with that player's stats
    function clickPlayer(username) {
        let clickedPlayer = players[players.findIndex(i => i.username === username)];
        if(!clickedPlayer) {
            console.log("currentPlayer is null");
            return;
        }
        currentPlayer = clickedPlayer;
        showSearchModal = true;
    }

    //Search a single player
    function searchPlayer(player) {
        currentPlayer = player;
        showSearchModal = true;
    }

    //TODO: Compare two players
    function comparePlayers(user1, user2) {
        firstPlayer = user1;
        secondPlayer = user2;
        showCompareModal = true;
    }

    //Sort main table by a specific skill
    async function searchSkill(skill) {
        const req = await fetch(`http://localhost:5000/api/highscores?skill=${skill}`);
        const res = await req.json();

        if (req.status === 200) {
            const sortedPlayers = res.data;   
            players = sortedPlayers;
        } else {
            if(res.success == false) {
                console.log(res.error);
                return;
            }
        }
        currentSkill = skill;
    }
</script>

<svelte:head>
	<title>Frostspire Highscores</title>
</svelte:head>

<section class="section">
    <div class="column is-8 is-offset-2">
            <!-- Skill icons -->
            <HighscoresSkillIcons on:searchSkill={(event) => searchSkill(event.detail.skill)} />
        </div>

    <div class="column is-8 is-offset-2">
        <div class="columns is-desktop">

            <div class="column is-three-fifths-desktop is-two-thirds-widescreen is-three-quarters-fullhd">
                <!-- Highscores Table -->
                <HighscoresTable on:clickedPlayer={(event) => clickPlayer(event.detail.username)} players={players} currentSkill={currentSkill} page={page}/>
            </div>

            <div class="column is-two-fifths-desktop is-one-third-widescreen is-one-quarter-fullhd">
                <!-- Search Player -->
                <HighscoresSearch on:searchPlayer={(event) => searchPlayer(event.detail.currentPlayer)} />

                <!-- Compare Players -->
                <HighscoresCompare on:comparePlayers={(event) => {comparePlayers(event.detail.firstPlayer, event.detail.secondPlayer)}} />
            </div>
        </div>
    </div>
</section>

<!-- Modal for viewing individual player's stats (click/search/compare players) -->
{#if showSearchModal}
    <HighscoresSearchModal on:closeModal={(event) => {showSearchModal = false}} currentPlayer={currentPlayer} />
{/if}
{#if showCompareModal}
    <HighscoresCompareModal on:closeModal={(event) => {showCompareModal = false}} firstPlayer={firstPlayer} secondPlayer={secondPlayer}/>
{/if}