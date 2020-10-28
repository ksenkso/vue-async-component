import Vue from "vue";
import {AsyncComponent, Component as C} from "vue/types/options";
import Component from "vue-class-component";

export type ComponentsDict = { [key: string]: C<any, any, any, any> | AsyncComponent<any, any, any, any> };
@Component
export default class WaitForComponents extends Vue {

    waitForComponents() {
        return this._waitForComponents(this.$options.components as ComponentsDict);
    }

    private _waitForComponents(components: ComponentsDict): Promise<any> {
        const loaders: Promise<any>[] = [];
        const vm = this;
        Object.entries(components).forEach((entry) => {
            const component = entry[1];
            // if the component is not synchronous
            if (!(typeof component === 'function' && component.prototype instanceof Vue)) {
                /**
                 * use these promises to check when the component itself has mounted and all its children.
                 * since children will always mount later, it is possible to only wait for children and
                 * to not wait for the component to mount: if children have been mounted,
                 * the component has been mounted too.
                 */
                /*let resolveSelf: () => void;
                const thisMounted = new Promise<void>(r => {
                    resolveSelf = r;
                });*/
                let resolveChildren: () => void;
                const childrenMounted = new Promise<void>(r => {
                    resolveChildren = r;
                });
                /**
                 * `resolved` will be set when the components is loaded,
                 *  so we should define it beforehand and catch the component to subscribe to `mounted` hook
                 */
                Object.defineProperty(component, 'resolved', {
                    set(loadedComponent) {
                        // add listener directly to component's mounted callbacks
                        this._resolved = loadedComponent;
                        if (loadedComponent.options.components) {
                            // wait until children are mounted then resolve a promise for children.
                            vm._waitForComponents(loadedComponent.options.components)
                                .then(() => resolveChildren())
                        } else {
                            resolveChildren();
                        }
                    },
                    get() {
                        return this._resolved;
                    },
                    configurable: true,
                    enumerable: true
                });
                loaders.push(childrenMounted);
            }
        })
        return Promise.all(loaders);
    }

}
