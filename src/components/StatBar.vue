<script setup>
defineProps({
  label: String,
  value: Number,
  max: { type: Number, default: 21 },
  color: String,
})
</script>

<template>
  <div class="stat">
    <span>{{ label }}</span>
    <div class="bar">
      <i :style="{ width: (value / max) * 100 + '%', background: color }" />
    </div>
    <b>{{ value }}</b>
  </div>
</template>

<style scoped>
.stat { display: grid; grid-template-columns: 178px 1fr 50px; align-items: center; margin-bottom: 23px; }
.bar { height: 25px; border-radius: 13px; background: var(--track); overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 13px; }
b { font-weight: 500; text-align: right; font-size: 22px; }

@media (max-width: 700px) {
  .stat { grid-template-columns: 110px 1fr 40px; font-size: 14px; }
  b { font-size: 18px; }
}
</style>
