<script setup>
import MapBase from '@/components/MapBase.vue'
</script>

<template>
  <main>
    <MapBase />
  </main>

  <div class="filtrage">
    <p>Filtrage</p>
    <div class="name">
      <div class="photo">
        <p>Bus : </p><img src="src/assets/icons/bus.svg" alt="bus">
      </div>
      <div class="photo">
        <p>Tram : </p><img src="src/assets/icons/tram.svg" alt="tram">
      </div>
      <div class="photo">
        <p>Bus et Tram : </p><img src="src/assets/icons/train-bus.svg" alt="bus-tram">
      </div>
      <div class="photo">
        <p>Ligne de transport : </p><div style="position: relative"><div class="ligne-couleur-fine"></div></div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.filtrage{
  display: flex;
  margin: 4% 3%;
}

.name{
  display: flex;
  flex-direction: column;
  margin-left: 30px;
}

.photo{
  display: flex;
}

.photo img{
  height: 20px;
  width: 25px;
}

.ligne-couleur-fine {
  width: 25px;
  height: 5px;
  background-color: red;
  margin-left: 5px;
  margin-top: 10px;
}

</style>
