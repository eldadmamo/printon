import { Suspense } from 'react';
import { lazyWithPreload } from '@/shared/utils/lazyWithPreload';
import { RoutableComponent } from '@/typings/routing';
import { loadData } from './loadData';
import { GiftFinderPageParams, GiftFinderPageProps } from './types';

const [GiftFinderPage, preload] = lazyWithPreload(
    () => import(/* webpackChunkName: 'gift-finder' */ './GiftFinderPage')
);

export const GiftFinder: RoutableComponent<GiftFinderPageParams, GiftFinderPageProps> = (props) => (
    <Suspense fallback={null}>
        <GiftFinderPage {...props} />
    </Suspense>
);

GiftFinder.loadData = loadData;

GiftFinder.paramsFromLocation = (_, queryParams: Record<string, string>) => ({
    gfPage: queryParams['gfPage'] || 'person',
    person: queryParams['person'] || '',
    budgetMin: queryParams['budgetMin'] || '',
    budgetMax: queryParams['budgetMax'] || '',
    category: queryParams['category'] || '',
    product: queryParams['product'] || '',
    design: queryParams['design'] || '',
    appearance: queryParams['appearance'] || '',
    productAppearance: queryParams['productAppearance'] || '',
});

GiftFinder.preload = preload;
GiftFinder.styles = ['gift-finder.css'];
