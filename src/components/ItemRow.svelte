<script lang="ts">
import { actions } from "astro:actions";
import type { HTMLAttributes, HTMLInputAttributes } from "svelte/elements";

type Props = HTMLAttributes<HTMLLIElement> & {
    showToggle: boolean;
    item: {
        id: string;
        type: "GIFT" | "IDEA" | "WISH";
        name: string;
        notes: string | null;
        link: string | null;
        purchased?: boolean;
    };
};
let { showToggle = false, item, ...rest }: Props = $props();

let purchased = $state((item.type !== "WISH" && item.purchased) ?? false);

const onchange = (async (e) => {
    const formData = new FormData();
    formData.set("id", item.id);
    formData.set("type", item.type);
    formData.set("purchased", e.currentTarget.checked.toString());

    const { data, error } = await actions.togglePurchased(formData);
    if (!error) purchased = data;
}) satisfies HTMLInputAttributes["onchange"];
</script>

<li class:purchased {...rest}>
    <div class="name">{item.name}</div>
    <div class="description">{item.notes}</div>

    {#if item.link}
        <a href={item.link} class="link">{item.link}</a>
    {/if}

    {#if item.type !== "WISH"}
        <input type="checkbox" checked={item.purchased} {onchange} />
    {/if}
</li>

<style>
    li {
        &.purchased {
            text-decoration: line-through;
            opacity: 0.5;
        }

        .description {
            font-style: italic;
        }
    }
</style>
