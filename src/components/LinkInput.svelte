<script lang="ts">
import { actions } from "astro:actions";
import type { OgObject } from "open-graph-scraper/types";
import type { HTMLInputAttributes } from "svelte/elements";

type Props = {
    inputErrors: {
        link?: string[] | undefined;
        name?: string[] | undefined;
        groups?: string[] | undefined;
        price?: string[] | undefined;
        notes?: string[] | undefined;
    };
};
let { inputErrors }: Props = $props();

let preview = $state<OgObject | undefined>();

const onpaste = (async (e) => {
    const formData = new FormData();
    formData.set(
        "link",
        e.clipboardData?.getData("text/plain")?.toString() ?? "",
    );

    const { data, error } = await actions.loadURLData(formData);
    if (!error) preview = data;

    console.log(data);
}) satisfies HTMLInputAttributes["onpaste"];
</script>

<div>
    <label for="form-wish-list-new.link">Link</label>
    <input
        type="text"
        inputmode="url"
        autocomplete="url"
        name="link"
        placeholder="www.example.com..."
        aria-describedby="form-wish-list-new.link.description"
        {onpaste}
    />
    <span id="form-wish-list-new.link.description"
        >Paste a link to automatically fill in the information</span
    >
    {#if inputErrors.link}
        <p id="error">{inputErrors.link.join(",")}</p>
    {/if}
</div>

<div>
    <label for="form-wish-list-new.name">Name</label>
    <input
        type="text"
        name="name"
        value={preview?.ogTitle}
        autocomplete="name"
        required
    />
    {#if inputErrors.name}
        <p id="error">{inputErrors.name.join(",")}</p>
    {/if}
</div>

<div>
    <label for="form-wish-list-new.notes">Note</label>
    <textarea
        name="notes"
        value={preview?.ogDescription}
        rows="3"
        placeholder="Type here more information about the item..."
    ></textarea>
    {#if inputErrors.notes}
        <p id="error">{inputErrors.notes.join(",")}</p>
    {/if}
</div>
