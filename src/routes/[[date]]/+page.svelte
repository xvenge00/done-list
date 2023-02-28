<script lang="ts">
	import type { DoneItems } from "$api/done/api";
    export let data: {
        done_items: DoneItems,
        date: string
    };
    import { goto } from "$app/navigation";
    import moment from "moment";
    import {toISOString} from "$lib/date"

    let dateChanged = () => {
        console.log(`date changed: ${data.date}`);
        goto(`${data.date}/`);
    }

    let dayBefore = () => {
        let parsed_date = moment(data.date).toDate();
        parsed_date.setDate(parsed_date.getDate()-1);
        let dayBeforeString = toISOString(parsed_date);
        goto(`${dayBeforeString}/`);
        console.log("day before");
    }

    let dayAfter = () => {
        let parsed_date = moment(data.date).toDate();
        parsed_date.setDate(parsed_date.getDate()+1);
        let dayAfterString = toISOString(parsed_date);
        goto(`${dayAfterString}/`);
        console.log("day after");
    }
</script>

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

<h1>Done list</h1>

<div>
    <button on:click={dayBefore}>&lt</button>
    <input type="date" bind:value={data.date} on:change={dateChanged}>
    <button on:click={dayAfter}>&gt</button>

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