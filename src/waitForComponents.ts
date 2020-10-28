import {AsyncComponent, Component} from "vue/types/options";
import Vue from "vue";

export type ComponentsDict = { [key: string]: Component<any, any, any, any> | AsyncComponent<any, any, any, any> };
export default function waitForComponents(components: ComponentsDict): Promise<any> {
    const loaders: Promise<any>[] = [];
    Object.entries(components).forEach(([name, component]) => {
        if (typeof component === 'function' && component.prototype instanceof Vue) {
            console.log(name, 'sync');
        } else {

            let resolveSelf: () => void;
            const thisMounted = new Promise<void>(r => {
                resolveSelf = r;
            });
            let resolveChildren: () => void;
            const childrenMounted = new Promise<void>(r => {
                resolveChildren = r;
            });
            const ready: Promise<void>[] = [thisMounted, childrenMounted];
            Object.defineProperty(component, 'resolved', {
                set(loadedComponent) {
                    this._resolved = loadedComponent;
                    // `mounted` array is always initialized with empty array
                    loadedComponent.options.mounted.push(() => {
                        resolveSelf();
                    });
                    if (loadedComponent.options.components) {
                        ready.push(waitForComponents(loadedComponent.options.components).then(() => resolveChildren()));
                    }
                },
                get() {
                    return this._resolved;
                }
            });
            loaders.push(Promise.all(ready));
        }
    })
    return Promise.all(loaders);
}
