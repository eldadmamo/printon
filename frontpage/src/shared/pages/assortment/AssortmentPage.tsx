import { FunctionComponent, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useGlobalData } from '@/globalData';
import { IntersectionObserverProvider } from '@/shared/IntersectionObserverContext';
import { BackToTopButton } from '@/shared/components/BackToTop/BackToTopButton';
import { Breadcrumb } from '@/shared/components/Breadcrumb/Breadcrumb';
import { DeliveryTimerToggle } from '@/shared/components/DeliveryTimer/DeliveryTimerToggle';
import { Loader } from '@/shared/components/Loader/Loader';
import { Page } from '@/shared/components/Page/Page';
import { Stack } from '@/shared/components/Stack/Stack';
import { Tiles } from '@/shared/components/Tiles/Tiles';
import { AssortmentCategoryList } from '@/shared/components/assortment/AssortmentCategoryList';
import { AssortmentDepartmentList } from '@/shared/components/assortment/AssortmentDepartmentList';
import { AssortmentFilterElements } from '@/shared/components/assortment/AssortmentFilterElements';
import { AssortmentListTile } from '@/shared/components/assortment/AssortmentListTile';
import { NoResults } from '@/shared/components/assortment/NoResults';
import { ProductTypeQuantitySelector } from '@/shared/components/assortment/ProductTypeQuantitySelector';
import { SeoText } from '@/shared/components/assortment/SeoText/SeoText';
import { getExtraTiles } from '@/shared/components/assortment/extraTiles/getExtraTiles';
import { useGetMaxAppearances } from '@/shared/components/assortment/useGetMaxAppearances';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';
import { useTrackPageChange } from '@/shared/hooks/useTrackPageChange';
import { getActiveFilters, getPageHeadline, getPageTitle } from '@/shared/utils/assortment';
import { REFINEMENT_SCREEN_PRINT_ID } from '@/shared/utils/constants';
import { RouteChildrenProps } from '@/typings/routing';
import { RouteContextProvider, useRouteContext } from './routeContext';
import { AssortmentPageProps } from './types';
import styles from './Assortment.module.scss';

type Page = FunctionComponent<AssortmentPageProps & RouteChildrenProps>;

const Content: Page = ({
                           assortment: { productTypes, filter: filters, discountQuantity, minMaxPrice },
                           canonical,
                           breadcrumbItems,
                           loadingState,
                           location,
                       }) => {
    const globalData = useGlobalData();
    const { language, platform, t } = globalData;
    const params = useRouteContext();

    useTrackPageChange('cyo/assortment/list', 'cyo-page-change');

    const activeFilters = getActiveFilters(params, filters, platform);
    const title = getPageTitle(activeFilters, language) || t('assortment.list.headline');
    const description = t('assortment.seo.description', title);
    const headline = getPageHeadline(activeFilters, language) || t('assortment.list.headline');

    useScrollToTop(canonical, location.hash.slice(1));

    const altGenderLabelIds = useMemo(
        () => filters.altGender.map((altGender) => altGender.id),
        [filters.altGender]
    );

    const [maxAppearances, tilesBoxRef] = useGetMaxAppearances();

    const productTypeTiles = productTypes?.map((productType, index) => (
        <AssortmentListTile
            key={productType.id}
            productType={productType}
            altGenderLabelIds={altGenderLabelIds}
            discountQuantity={discountQuantity}
            maxAppearances={maxAppearances}
            lazy={index > 8}
        />
    ));

    const tiles = getExtraTiles(productTypeTiles, params, globalData);

    return (
        <Page>
            <Helmet>
                <title>{title} | Destamerch</title>
                <meta name="description" property="description" content={description} />
                <link rel="canonical" href={canonical} />
            </Helmet>
            <Stack>
                <header>
                    <Breadcrumb items={breadcrumbItems} />
                    <div className={styles.headline}>
                        <h1>{headline}</h1>
                        {` (${productTypes.length}\u00A0${
                            productTypes.length > 1 ? t('assortment.list.categories') : t('giftfinder.product')
                        })`}
                    </div>
                </header>
                <div className={styles.columns}>
                    <aside className={styles.columnSide}>
                        <div className={styles.sidebarPanelWrapper}>
                            <ProductTypeQuantitySelector
                                quantity={discountQuantity}
                                isScreenPrint={activeFilters.refinement?.id === REFINEMENT_SCREEN_PRINT_ID}
                            />
                            <div className={styles.desktopFilters}>
                                <AssortmentCategoryList
                                    filters={filters}
                                    activeId={activeFilters.category?.id}
                                    title={t('assortment.list.categories')}
                                    isOpenInitial
                                />
                                <AssortmentDepartmentList
                                    filters={filters}
                                    title={t('assortment.list.departments')}
                                    isOpenInitial
                                />
                            </div>
                        </div>
                    </aside>
                    <div className={styles.columnMain}>
                        <Stack space={16}>
                            <DeliveryTimerToggle />
                            <AssortmentFilterElements
                                filters={filters}
                                activeFilters={activeFilters}
                                params={params}
                                discountQuantity={discountQuantity}
                                minMaxPrice={minMaxPrice}
                                numberOfProducts={productTypes.length}
                            />
                            {productTypes.length === 0 && (
                                <NoResults activeFilters={activeFilters} sort={params.sort} />
                            )}
                            <div className={styles.tilesBox} ref={tilesBoxRef}>
                                <Tiles
                                    columns={1}
                                    columnsXsMobile={2}
                                    columnsMobile={2}
                                    columnsDesktop={3}
                                    space={3 /* AssortmentListTile padding / 2 */}
                                >
                                    {tiles}
                                </Tiles>
                                {loadingState === 'loading' && <Loader />}
                            </div>
                        </Stack>
                    </div>
                </div>
                <BackToTopButton />
                <SeoText category={activeFilters.category} />
            </Stack>
        </Page>
    );
};

const AssortmentPage: Page = (props) => (
    <RouteContextProvider
        location={props.location}
        defaultQuantity={props.assortment.discountQuantity}
    >
        <IntersectionObserverProvider>
            <Content {...props} />
        </IntersectionObserverProvider>
    </RouteContextProvider>
);

export default AssortmentPage;
