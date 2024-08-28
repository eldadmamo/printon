import {ComponentType, lazy} from "react";

export const lazyWithPreload = <ImportedComponent extends ComponentType<any>>(
    factory:() => Promise<{default: ImportedComponent}>
) => {

    let factoryPromise: Promise<{default: ImportedComponent}> | undefined;

    const load = () => {
        if(!factoryPromise){
            factoryPromise = factory();
        }

        return factoryPromise;
    }

    const LazyComponent = lazy(load);

    return [LazyComponent,load] as const;
}