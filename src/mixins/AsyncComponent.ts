import Component from "vue-class-component";
import Vue from "vue";

@Component
export default class AsyncComponent extends Vue {
    mounted() {
        this.$emit('ready');
    }
}
