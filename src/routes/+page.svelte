<script lang="ts">
	import type { DoneItems } from "$api/done/api";
    export let data: {
        done_items: DoneItems
    };
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
    <form method="POST" action="?/create">
        <input name="text" />
        <input type="submit" value="I've done this"/>
    </form>

    <ul class="list">
        {#each data.done_items as item}
        <li class="list-item">
            <div class="list">
                <form method="POST" action="?/delete">
                    {item.text}
                    <input type="hidden" name="uid" value={item.uid} />
                    <button aria-label="Mark as complete">x</button>
                </form>
            </div>
        </li>
        {/each}
    </ul>
</div>