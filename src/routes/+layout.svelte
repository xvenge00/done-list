<script>
    import '../app.css'
</script>

<div id="main">

  <!-- <h1 class="grid h-screen place-content-center text-8xl">
    Heading
  </h1> -->
  

  <slot />
</div>

<style>
  #main {
    flex:1;
  }
  :global(body) {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
    max-width: 800px;
    /* min-height: 100%; */
    min-height: 100vh;
    margin: 0 auto;
    background: #fff;
    color: #333;
    display:flex;
    flex-direction:column;
  }
  :global(li),
  :global(p) {
    line-height: 1.5rem;
  }
  :global(a) {
    font-weight: 500;
  }
  :global(html) {
    height: 100%;
  }
</style>
