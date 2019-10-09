<template>
  <div>
    <p>Hello world!</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
