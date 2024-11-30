<script lang="ts">
import { actions } from "astro:actions";
import type { HTMLInputAttributes } from "svelte/elements";

type Props = HTMLInputAttributes & {
    item_id: string;
    type: "IDEA" | "GIFT";
};
let { checked = false, item_id, type, ...rest }: Props = $props();

const onchange = (async (e) => {
    const formData = new FormData();
    formData.set("id", item_id);
    formData.set("type", type);
    formData.set("purchased", e.target.checked);

    await actions.togglePurchased(formData);
}) satisfies HTMLInputAttributes["onchange"];
</script>

<input type="checkbox" {checked} {onchange} {...rest} />
