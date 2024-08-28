import {FunctionComponent,ReactNode,createContext,useContext} from "react";
import {hasOwnProperty} from "./shared/utils/hasOwnProperty";
import React from "react";

interface GlobalData {
    translations: Record<string, string>;
    abTest: string[];
}
export interface GlobalDataContextType extends GlobalData {
    t: (key: string, ...replacements: string[]) => string;
    renderTemplateString: (
        string: string,
        renderFunction: (subString: string, index: number) => ReactNode
    ) => ReactNode[];
}

const GlobalDataContext = createContext<GlobalDataContextType>(null);

interface GlobalDataProviderProps {
    value: GlobalData;
    children: ReactNode;
}

export const GlobalDataProvider: FunctionComponent<GlobalDataProviderProps> = ({
                                                                                   value,
                                                                                   children,
                                                                               }) => {
    const translations = value.translations;
    const t = (key: string, ...replacements: string[]) => {
        let value: string;

        if (hasOwnProperty(translations, key)) {
            value = translations[key];
        }

        if (!value && process.env.NODE_ENV !== 'production') {
            console.log(`Missing translation key: ${key}`);
        }

        if (value && replacements && replacements.length) {
            replacements.forEach((replacement, index) => {
                value = value.split(`%${index}`).join(replacement || '');
            });
        }

        return value || '';
    };

    const renderTemplateString = (
        string: string,
        renderFunction: (subString: string, index: number) => ReactNode
    ): ReactNode[] => {
        const split = string.split(/[[\]]/g).filter((s) => s);
        return split.map((subString, i) => {
            if (subString.includes('|')) {
                return renderFunction(subString.substring(0, subString.indexOf('|')), i);
            }
            return subString;
        });
    };

    const extendedValue: GlobalDataContextType = {
        ...value,
        t,
        renderTemplateString,
    };

    return <GlobalDataContext.Provider value={extendedValue}>{children}</GlobalDataContext.Provider>;
};

export const useGlobalData = () => useContext(GlobalDataContext);
