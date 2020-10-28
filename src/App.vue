<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import waitForComponents from "@/waitForComponents";

const HelloWorld = () => ({
  component: import(/* webpackChunkName: "hello-world" */'./components/HelloWorld.vue'),
});

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  mounted() {
    waitForComponents(this.$options.components)
      .then(() => {
        console.log('all components have loaded');
        console.dir(this.$options.components);
      })
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
