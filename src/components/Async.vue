<template>
  <h3>Hello, I'm async!!!</h3>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import AsyncComponent from '@/mixins/AsyncComponent.ts';
import {mixins} from "vue-class-component";

@Component({
  name: 'Async'
})
export default class Async extends mixins<AsyncComponent>(AsyncComponent) {

}
</script>

<style scoped>

</style>
