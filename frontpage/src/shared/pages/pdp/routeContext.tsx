import { FunctionComponent, ReactNode, createContext, useContext } from 'react';
import { Location } from 'history';
import { useParseLocation } from '@/shared/hooks/useParseLocation';
import { pdp as pdpRoute } from '@/shared/routes';
import { PdpPageParams } from './types';

const RouteContext = createContext<PdpPageParams>(null);

interface RouteContextProviderProps {
    location: Location;
    children: ReactNode;
}

export const RouteContextProvider: FunctionComponent<RouteContextProviderProps> = ({
                                                                                       location,
                                                                                       children,
                                                                                   }) => {
    const value = useParseLocation<PdpPageParams>(pdpRoute, location);

    return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
};

export const useRouteContext = () => useContext(RouteContext);
