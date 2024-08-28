import { Suspense } from 'react';
import { lazyWithPreload } from '@/shared/utils/lazyWithPreload';
import { RoutableComponent } from '@/typings/routing';
import { loadData } from './loadData';
import { AssortmentPageParams, AssortmentPageProps } from './types';

const [AssortmentPage, preload] = lazyWithPreload(
    () => import(/* webpackChunkName: 'assortment' */ './AssortmentPage')
);

export const Assortment: RoutableComponent<AssortmentPageParams, AssortmentPageProps> = (props) => (
    <Suspense fallback={null}>
        <AssortmentPage {...props} />
    </Suspense>
);

Assortment.loadData = loadData;

Assortment.paramsFromLocation = (
    path: string,
    queryParams: Record<string, string>
): AssortmentPageParams => {
    const regex = /^(D\d+)?(CG\d+)?(F\d+)?(A\d+)?(S\d+)?/g;
    const lastUrlPathPart = path.split('-').pop();
    const matches = regex.exec(lastUrlPathPart);

    return {
        department: matches[1],
        category: matches[2],
        feature: matches[3],
        appearance: matches[4],
        size: matches[5],
        brand: queryParams['brand'] ? decodeURIComponent(queryParams['brand']) : undefined, //otherwise there will be an undefined as string word
        sort: queryParams['sort'],
        quantity: queryParams['quantity'],
        refinement: queryParams['refinement'],
        materials: queryParams['materials'],
        fit: queryParams['fit'],
        style: queryParams['style'],
        neckline: queryParams['neckline'],
        sleeve: queryParams['sleeve'],
        maxPrice: queryParams['maxPrice'],
    };
};

Assortment.preload = preload;
Assortment.styles = ['assortment.css'];
