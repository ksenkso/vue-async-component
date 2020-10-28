import {AsyncComponent, Component} from "vue/types/options";
import Vue from "vue";

export type ComponentsDict = { [key: string]: Component<any, any, any, any> | AsyncComponent<any, any, any, any> };
export default function waitForComponents(components: ComponentsDict) {
    const loaders: Promise<void>[] = [];
    Object.entries(components).forEach(([name, component]) => {
        if (typeof component === 'function' && component.prototype instanceof Vue) {
            console.log(name, 'sync');
        } else {
            let resolve: () => void;
            const promise = new Promise<void>(r => {
                resolve = r;
            });
            Object.defineProperty(component, 'resolved', {
                set(loadedComponent) {
                    this._resolved = loadedComponent;
                    // `mounted` array is always initialized with empty array
                    loadedComponent.options.mounted.push(() => {
                        console.log('mounted - ', name);
                    })
                    console.dir(loadedComponent);
                    if (loadedComponent.options.components) {
                        waitForComponents(loadedComponent.options.components)
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
