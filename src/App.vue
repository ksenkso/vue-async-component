<template>
  <div id="app">
    <img @click="log" alt="Vue logo" src="./assets/logo.png">
    <HelloWorld ref="hello" msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator';
import {mixins} from "vue-class-component";
import WaitForComponents from "@/mixins/WaitForComponents";

const HelloWorld = () => import(/* webpackChunkName: "hello-world" */'./components/HelloWorld.vue');

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends mixins<any>(WaitForComponents) {

  @Ref('hello') hello!: Vue;

  mounted() {
    this.waitForComponents()
      .then(() => {
        console.log(this.hello.$refs.async);
      })
  }

  log() {
    console.log(this.hello);
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
