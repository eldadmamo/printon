let supportsPassiveListenersResult: boolean;

export const supportsPassiveListeners = () => {
    if(supportsPassiveListenersResult !== undefined){
        return supportsPassiveListenersResult;
    }

    try{
        const opts = Object.defineProperty({},'passive', {
            get: () => {
                supportsPassiveListenersResult = true
            },
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
    } catch (e) {

    }

    return supportsPassiveListenersResult;
}