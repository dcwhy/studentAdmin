<template>
  <vue-particles color="#fff" :particleOpacity="0.7" :particlesNumber="150" shapeType="star" :particleSize="4" linesColor="#fff" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="6" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push"
  class="lizi" />
</template>

<script>
export default {
  name: 'background'
}
</script>

<style>
.lizi{
  width: 100%;
  height: 100%;
  background: url('../../icons/1.png') no-repeat;
  background-size: cover;
}
</style>
