interface Satellite {
    track: (eventName: string, featureData?: FeatureData) => void;
}

declare global {
    interface Window {
        _satellite: Satellite;
        trackingData: Record<string, any>;
    }
}

const MAX_TRIES = 10;
let tries = 0;
let tracker: Satellite;

const isObject = (item: any) => item && typeof item === 'object' && !Array.isArray(item);

const mergeDeep = (target: Record<string, any>, source: Record<string, any>) => {
    Object.entries(source).forEach((entry) => {
        const key = entry[0];
        const value = entry[1];
        if (isObject(value)) {
            if (!target[key]) {
                Object.assign(target, {
                    [key]: {},
                });
            }
            mergeDeep(target[key], value);
        } else {
            Object.assign(target, {
                [key]: value,
            });
        }
    });
};

export const init = (data: Record<string, any>) => {
    window.trackingData = window.trackingData || {};
    mergeDeep(window.trackingData, data);

    waitForSatellite();
};

const waitForSatellite = () => {
    if (process.env.NODE_ENV !== 'production') {
        tracker = {
            track: (...args) => {
                console.group('tracking call');
                console.log('args', args);
                console.log('data', window.trackingData);
                console.groupEnd();
            },
        };
    } else {
        tries += 1;
        const satellite = window._satellite;
        if (satellite && satellite.track && typeof satellite.track === 'function') {
            tracker = satellite;
        } else if (tries >= 0 && tries <= MAX_TRIES) {
            setTimeout(waitForSatellite, 200);
        } else {
            console.warn(`could not find tracker after ${MAX_TRIES} attempts`);
        }
    }
};

export const track = (eventName: string, eventData: Record<string, any>) => {
    if (tracker) {
        window.trackingData = window.trackingData || {};
        mergeDeep(window.trackingData, eventData);
        tracker.track(eventName);
    }
};

interface FeatureData {
    featureName: string;
    [key: string]: any;
}

export const trackFeature = (featureData: FeatureData) => {
    if (tracker) {
        tracker.track('cyo-feature-used', featureData);
    }
};
