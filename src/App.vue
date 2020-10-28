<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script>
import {Component, Vue} from 'vue-property-decorator';

const HelloWorld = () => ({
  component: import(/* webpackChunkName: "hello-world" */'./components/HelloWorld.vue')
      .then(c => c),
});

function checkAsyncComponents(components) {
  const loaders = [];
  Object.entries(components).forEach(([name, component]) => {
    if (typeof component === 'function' && component.prototype instanceof Vue) {
      console.log(name, 'sync');
    } else {
      let resolve;
      const promise = new Promise(r => {
        resolve = r;
      });
      Object.defineProperty(component, 'resolved', {
        set(loadedComponent) {
          this._resolved = loadedComponent;
          if (loadedComponent.options.components) {
            checkAsyncComponents(loadedComponent.options.components)
              .then(resolve)
          } else {
            resolve();
          }
        },
        get() {
          return this._resolved;
        }
      });
      loaders.push(promise);
    }
  })
  return Promise.all(loaders);
}


@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  mounted() {
    checkAsyncComponents(this.$options.components)
      .then(() => {
        console.log('all components have loaded');
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
