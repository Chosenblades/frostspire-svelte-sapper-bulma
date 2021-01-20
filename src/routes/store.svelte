<script context="module">
	export async function preload( page, session ) {

        if(!session || !session.token) {
            this.redirect(302, 'login');
        }
        
	}
</script>

<script>
</script>

<style>
</style>

Store