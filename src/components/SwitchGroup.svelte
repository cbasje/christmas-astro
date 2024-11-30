<script lang="ts">
import { actions } from "astro:actions";
import { onMount } from "svelte";
import type { HTMLAttributes, HTMLInputAttributes } from "svelte/elements";
import type { Group } from "../db/schema/auth";

type Props = HTMLAttributes<HTMLFormElement> & {
    group: Group;
};
let { group, ...rest }: Props = $props();

let form = $state<HTMLFormElement>();
let submitButton = $state<HTMLButtonElement>();

const onchange = (async (e) => {
    form.submit();
}) satisfies HTMLInputAttributes["onchange"];

onMount(() => {
    submitButton.style.display = "none";
});
</script>

<form bind:this={form} method="POST" action={actions.switchGroup} {...rest}>
	<fieldset>
	  <legend class="sr-only">Select a group</legend>
	
	  <div>
		<input type="radio" id="ben" name="group" value="BENJAMINS" checked={group === 'BENJAMINS'} {onchange} />
		<label for="ben">Benjamins</label>
	  </div>
	
	  <div>
		<input type="radio" id="hau" name="group" value="HAUGEN" checked={group === 'HAUGEN'} {onchange} />
		<label for="hau">Haugen</label>
	  </div>
	</fieldset>

	<button bind:this={submitButton} type="submit">Switch</button>
</form>