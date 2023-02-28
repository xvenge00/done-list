<script lang="ts">
    import {add_item_today, get_list} from "$lib/list"
	import { listen } from "svelte/internal";

    let new_item = "";

    let items = ["vstat", "lahnut si", "nieco"];

    async function addNewItem() {
        await add_item_today(new_item);

        items.push(new_item);
        items = items;
        new_item = ""
        // items = [...items, "cau"];
    }
</script>

<h1>Done list</h1>

<style>
    ul.list {
        width: 80%;
        height: 40px;
        padding: 5px; 
        position: absolute;
    }

    li.list-item {
        width: 80%;
        height: 40px;
        margin: 5px;
        border: 1px solid black; 
    }
</style>

<title>Done list</title>
<div>
    <form on:submit={addNewItem}>
        <input bind:value={new_item}/>
        <input type="submit" value="I've done this"/>
    </form>

    <ul class="list">
        {#await get_list()}
            Loading list...
        {:then list}
            {#if list}
                {#each list as item}
                <li class="list-item">
                    <div class="list">
                        {item.text}
                    </div>
                </li>
                {/each}
            {/if}
        {/await}
    </ul>
</div>