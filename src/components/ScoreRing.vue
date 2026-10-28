<script setup>
defineProps({
  label: String,
  score: Number,
  color: { type: String, default: 'var(--purple)' },
})
</script>

<template>
  <div class="score">
    <h3>{{ label }}<br />Score</h3>
    <div
      class="ring"
      :style="{ background: `conic-gradient(${color} ${score * 3.6}deg, var(--track) 0)` }"
    >
      <span>{{ score }}/100</span>
    </div>
  </div>
</template>

<style scoped>
.score { width: 160px; text-align: center; }
h3 { font-size: 20px; font-weight: 700; margin-bottom: 24px; min-height: 50px; }
.ring {
  position: relative;
  width: 143px; height: 143px; margin: 0 auto;
  border-radius: 50%;
  display: grid; place-items: center;
}
/* hollow out the centre so only a 14px band shows */
.ring::before {
  content: '';
  position: absolute; inset: 14px;
  border-radius: 50%; background: #fff;
}
.ring span { position: relative; }
</style>
