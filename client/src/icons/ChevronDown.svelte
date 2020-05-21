<script>
  export let color = "#333";
  export let width;
</script>

<svg
  style={width ? `width:${width}px` : ''}
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width="2"
  stroke={color}
  viewBox="0 0 24 24">
  <path d="M19 9l-7 7-7-7" />
</svg>
