<script lang="ts">
  import type { Definition } from '../stores/definition'

  export let name: string
  export let definition: Definition
</script>

<h1>{name}</h1>
<div>{JSON.stringify(definition)}</div>
<hr />
