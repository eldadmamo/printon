import { FunctionComponent, ReactNode, createContext, useContext } from 'react';
import { Location } from 'history';
import { useParseLocation } from '@/shared/hooks/useParseLocation';
import { assortment as assortmentRoute } from '@/shared/routes';
import { AssortmentPageParams } from './types';

const RouteContext = createContext<AssortmentPageParams>(null);

interface RouteContextProviderProps {
    location: Location;
    defaultQuantity?: number;
    children: ReactNode;
}
export const RouteContextProvider: FunctionComponent<RouteContextProviderProps> = ({
                                                                                       location,
                                                                                       defaultQuantity,
                                                                                       children,
                                                                                   }) => {
    const params = useParseLocation<AssortmentPageParams>(assortmentRoute, location);

    // the !(...) is important because if params.quantity parses to NaN all comparisons are false
    if (defaultQuantity > 0 && !(parseInt(params.quantity, 10) > 0)) {
        // if params.quantity is undefined/invalid use the quantity sent from the backend
        params.quantity = String(defaultQuantity);
    }

    return <RouteContext.Provider value={params}>{children}</RouteContext.Provider>;
};

export const useRouteContext = () => useContext(RouteContext);
