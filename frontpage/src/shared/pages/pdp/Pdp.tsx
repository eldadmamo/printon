import { Suspense } from 'react';
import { lazyWithPreload } from '@/shared/utils/lazyWithPreload';
import { RoutableComponent } from '@/typings/routing';
import { loadData } from './loadData';
import { PdpPageParams, PdpPageProps, PdpRedirectProps } from './types';

const [PdpPage, preload] = lazyWithPreload(() => import(/* webpackChunkName: 'pdp' */ './PdpPage'));

export const Pdp: RoutableComponent<PdpPageParams, PdpPageProps | PdpRedirectProps> = (props) => (
    <Suspense fallback={null}>
        <PdpPage {...props} />
    </Suspense>
);

Pdp.loadData = loadData;

Pdp.preventLoadData = (currentParams, nextParams) => {
    return (
        (currentParams as PdpPageParams).productTypeId === (nextParams as PdpPageParams).productTypeId
    );
};

Pdp.paramsFromLocation = (path: string, queryParams: Record<string, string>) => {
    const regex = /^PT(\d+)?/gi;
    const lastUrlPathPart = path.split('-').pop();
    const matches = regex.exec(lastUrlPathPart);

    return {
        productTypeId: matches?.[1],
        appearanceId: queryParams['appearance'],
        discountQuantity: queryParams['quantity'],
        poQuantity: queryParams['poQuantity'],
        poViews: queryParams['poViews'],
        poPrintType: queryParams['poPrintType'],
    };
};

Pdp.preload = preload;
Pdp.styles = ['pdp.css'];
