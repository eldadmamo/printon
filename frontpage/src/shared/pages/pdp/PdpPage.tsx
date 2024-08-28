import {
    Fragment,
    FunctionComponent,
    MutableRefObject,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Helmet } from 'react-helmet-async';
import cn from 'classnames';
import { useGlobalData } from '@/globalData';
import { IntersectionObserverProvider } from '@/shared/IntersectionObserverContext';
import { NotFound } from '@/shared/NotFound';
import { Breadcrumb } from '@/shared/components/Breadcrumb/Breadcrumb';
import { Collapse, CollapseRef } from '@/shared/components/Collapse/Collapse';
import { Column } from '@/shared/components/Column/Column';
import { Columns } from '@/shared/components/Columns/Columns';
import { Inline, justifyCenter, nowrap } from '@/shared/components/Inline/Inline';
import { LoadingImage } from '@/shared/components/LoadingImage/LoadingImage';
import { Page } from '@/shared/components/Page/Page';
import { Appearances } from '@/shared/components/Pdp/Appearances';
import { CTA, CTACart, CTAStockOut } from '@/shared/components/Pdp/CTA';
import { DeliveryInformation } from '@/shared/components/Pdp/DeliveryInformation';
import { DesignSizeRatio } from '@/shared/components/Pdp/DesignSizeRatio';
import { MicroData } from '@/shared/components/Pdp/MicroData';
import { OrderSampleTrigger } from '@/shared/components/Pdp/OrderSample/OrderSampleTrigger';
import { PriceCalculatorTrigger } from '@/shared/components/Pdp/PriceCalculator/PriceCalculatorTrigger';
import { PrintTypesInformation } from '@/shared/components/Pdp/PrintTypesInformation';
import { ProductImageMain } from '@/shared/components/Pdp/ProductImageMain';
import { RatingHeadline } from '@/shared/components/Pdp/RatingHeadline';
import { RatingSection } from '@/shared/components/Pdp/RatingSection';
import { RelatedProductType } from '@/shared/components/Pdp/RelatedProductType';
import { SizeSection } from '@/shared/components/Pdp/SizeSection';
import { Sizes } from '@/shared/components/Pdp/Sizes';
import { QuantitySelector } from '@/shared/components/QuantitySelector/QuantitySelector';
import { Rating } from '@/shared/components/Rating/Rating';
import { DisplayedItemsByWindowWidth, Slider } from '@/shared/components/Slider/Slider';
import { Stack } from '@/shared/components/Stack/Stack';
import { Text } from '@/shared/components/Text/Text';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';
import { useTrackPageChange } from '@/shared/hooks/useTrackPageChange';
import { getAllImageUrls } from '@/shared/pages/pdp/images';
import { MINIMUM_ITEMS_FOR_SCREEN_PRINT, SCREEN_PRINT_ID } from '@/shared/utils/constants';
import { getPriceFormatter } from '@/shared/utils/formatPrice';
import { getDefaultAppearanceId } from '@/shared/utils/getDefaultAppearanceId';
import { getDefaultViewId } from '@/shared/utils/getDefaultViewId';
import { getMaterialViewId } from '@/shared/utils/getMaterialViewId';
import { PrintTypes } from '@/shared/utils/printTypes';
import { PrintingOptions } from '@/shared/utils/printingOptions';
import { productTypeImageUrl } from '@/shared/utils/urls';
import { WarningTypes } from '@/shared/utils/warningTypes';
import { RouteChildrenProps } from '@/typings/routing';
import { RouteContextProvider, useRouteContext } from './routeContext';
import { PdpPageParams, PdpPageProps, PdpRedirectProps } from './types';
import styles from './Pdp.module.scss';

const IMAGE_SIZE = 350;
const NUMBER_OF_DISPLAYED_ITEMS: DisplayedItemsByWindowWidth = [2.1, 3.1, 4.1, 4.1, 5];

const getAppearance = (productType: ProductType, appearanceId: string) =>
    productType.appearances.find((a) => a.id === appearanceId);

const getCurrentAppearance = (params: PdpPageParams, productType: ProductType) => {
    const paramsAppearanceId = params.appearanceId;
    if (paramsAppearanceId) {
        const paramsAppearance = getAppearance(productType, paramsAppearanceId);
        if (paramsAppearance) {
            return paramsAppearance;
        }
    }

    return getAppearance(productType, getDefaultAppearanceId(productType));
};

type PageProps = PdpPageProps | PdpRedirectProps;
type Page = FunctionComponent<PageProps & RouteChildrenProps>;
type PdpRoutePage = FunctionComponent<PdpPageProps & RouteChildrenProps>;

const Content: PdpRoutePage = ({
                                   productType,
                                   modelImages,
                                   currency,
                                   rating,
                                   ratingDetails,
                                   productTypeCategory,
                                   deliveryETA,
                                   deliveryPrintTypeIds,
                                   brandName,
                                   relatedProductTypes,
                                   printTypes,
                                   canonical,
                                   alternates,
                                   breadcrumbItems,
                                   discountQuantity,
                                   discounts,
                                   printAreaAmount,
                                   embroideryPrintAreaAmount,
                                   isPrintable,
                               }) => {
    const { imageServerBase, intlLocale, t } = useGlobalData();
    const routeContext = useRouteContext();
    const currentAppearance = getCurrentAppearance(routeContext, productType);
    const currentAppearanceId = currentAppearance.id;
    const [sizeError, setSizeError] = useState(false);

    // if PDP page, hide sticky contact button to prioritize sticky CTA footer
    useEffect(() => {
        const stickyContact = document.getElementById('sticky-contact');
        if (stickyContact) {
            const currentDisplay = stickyContact.style.display;
            stickyContact.style.display = 'none';
            return () => {
                stickyContact.style.display = currentDisplay;
            };
        }
    }, []);

    useTrackPageChange('cyo/assortment/detail', 'cyo-page-change');
    useScrollToTop(canonical);

    const appearancePrintTypes = currentAppearance.printTypes;
    const isScreenPrintAppearance = appearancePrintTypes.some(
        (pt) => pt.id === PrintTypes.Screenprint
    );
    const [selectedQuantity, setSelectedQuantity] = useState(discountQuantity);
    const [selectedSize, setSelectedSize] = useState<string>(
        productType.sizes.length === 1 ? productType.sizes[0].id : undefined
    );

    const discount = discounts.find(
        ({ from, to }) => selectedQuantity >= from && (!to || selectedQuantity <= to)
    )?.value;
    const displayedPrice = discount
        ? productType.price.vatIncluded - (productType.price.vatIncluded * discount) / 100
        : productType.price.vatIncluded;
    const totalPrice = displayedPrice * selectedQuantity;

    const priceInfo = t(
        isPrintable
            ? printAreaAmount.first === 0
                ? 'price.inclPrintCost.perItem'
                : 'price.perItem'
            : 'priceCalculator.perPiece'
    );

    const discountFrom = discounts.find(({ from, value }) => from && value);
    const hasVolumeDiscount = Boolean(discountFrom);

    const formatPrice = useMemo(
        () => getPriceFormatter(currency, intlLocale),
        [intlLocale, currency]
    );
    const formattedPrice = formatPrice(displayedPrice);
    const formattedSinglePrice = formatPrice(productType.price.vatIncluded);
    const formattedTotalPrice = formatPrice(totalPrice);

    const materialViewId = getMaterialViewId(productType);

    const isBlankVerboten = productType.labels.warningIds.includes(WarningTypes.NoBlank);
    let isStockOut = true;
    for (const stockState of productType.stockStates) {
        if (stockState.available && stockState.appearance.id === currentAppearanceId) {
            isStockOut = false;
            break;
        }
    }

    const availableSizes = productType.sizes.filter((size) =>
        productType.stockStates.some((s) => s.size.id === size.id && s.available)
    );

    const ratingSection = useRef<CollapseRef>();
    const sizeTable = useRef<CollapseRef>();
    const scrollToSection = (section: 'ratingSection' | 'sizeTable') => {
        let ref: MutableRefObject<CollapseRef>;
        if (section === 'ratingSection') {
            ref = ratingSection;
        } else if (section === 'sizeTable') {
            ref = sizeTable;
        }

        ref?.current?.show();
    };

    const showPrintTypesSection =
        isPrintable &&
        (productType.printingOptions === PrintingOptions.MIXED || // if embroidery is possible, we automatically have more than one print option
            (appearancePrintTypes.length === 1 && appearancePrintTypes[0].id === SCREEN_PRINT_ID) || // don't show the section, if there is only one printType, except it's screen printing
            appearancePrintTypes.filter((pt) => !printTypes[pt.id]?.isDigital).length > 1); // //since we only show one digital printType, check if there are any other pts

    const imageUrls = getAllImageUrls(
        imageServerBase,
        productType,
        currentAppearance.id,
        modelImages
    );
    const openGraphImageUrl = imageUrls[0].openGraph;

    const screenPrintingMinimum = isScreenPrintAppearance ? (
        <p className={styles.priceDetails}>{t('assortment.tile.badgeMinimum')}</p>
    ) : null;

    const priceAndInfos = (
        <div className={styles.priceBox}>
            <div>
                <strong className={styles.formattedPrice}>{formattedPrice}</strong>
                {displayedPrice !== productType.price.vatIncluded && (
                    <Fragment>
                        {
                            '\u00A0 ' /* normal space to allow wrapping and no-break space to prevent collapsing */
                        }
                        <span className={cn(styles.formattedPrice, styles.strikeOut)}>
              {formattedSinglePrice}
            </span>
                    </Fragment>
                )}
            </div>
            <p className={styles.priceDetails}>{priceInfo}</p>
            {discount ? (
                <p className={styles.discountLine}>
                    {t('priceCalculator.discountNow', discount.toString(), selectedQuantity.toString())}
                </p>
            ) : (
                hasVolumeDiscount && (
                    <p className={styles.discountLine}>
                        {t(
                            'priceCalculator.discountItem',
                            discountFrom.from.toString(),
                            discountFrom.value.toString()
                        )}
                    </p>
                )
            )}
            {!hasVolumeDiscount && screenPrintingMinimum}
        </div>
    );

    const priceBlock =
        hasVolumeDiscount || !isPrintable ? (
            <Columns className={styles.marginBottomBig}>
                <Column width="1/2">{priceAndInfos}</Column>
                <Column width="1/2">
                    <QuantitySelector
                        inputId="quantity"
                        quantity={selectedQuantity}
                        minValue={isScreenPrintAppearance ? MINIMUM_ITEMS_FOR_SCREEN_PRINT : 1}
                        maxValue={100000000}
                        onChange={setSelectedQuantity}
                        decreaseLabel={t('assortment.button.decreaseQuantity')}
                        increaseLabel={t('assortment.button.increaseQuantity')}
                    >
                        <Text weight="strong" size="small">
                            {t('priceCalculator.quantity')}
                        </Text>
                    </QuantitySelector>
                    {screenPrintingMinimum}
                </Column>
            </Columns>
        ) : (
            <div className={styles.marginBottomBig}>{priceAndInfos}</div>
        );

    return (
        <>
            <Helmet>
                <title>{`${productType.name} | Destamerch`}</title>
                <meta name="description" property="description" content={productType.name} />
                {Object.entries(alternates).map(([locale, url]) => (
                    <link key={locale} rel="alternate" hrefLang={locale.replace('_', '-')} href={url} />
                ))}
                <link rel="canonical" href={canonical} />
                <meta id="openGraphImage" property="og:image" content={openGraphImageUrl} />
                <meta id="openGraphWidth" property="og:image:width" content="1200" />
                <meta id="openGraphHeight" property="og:image:height" content="1200" />
                <meta id="openGraphImageType" property="og:image:type" content="jpg" />
            </Helmet>
            <Page itemScope itemType="http://schema.org/Product">
                <MicroData
                    productType={productType}
                    appearance={currentAppearance}
                    modelImages={modelImages}
                    brandName={brandName}
                    rating={rating}
                    productTypeCategoryName={productTypeCategory?.name}
                    isStockOut={isStockOut}
                    price={displayedPrice}
                    currencyCode={currency.isoCode}
                    imageServerBase={imageServerBase}
                />
                <Stack space={0}>
                    <header>
                        <Breadcrumb items={breadcrumbItems} />
                    </header>
                    <div className={styles.mainGrid}>
                        <div className={styles.headlineAndRating}>
                            <h1 className={styles.headline}>{productType.name}</h1>
                            {rating && (
                                <button
                                    type="button"
                                    onClick={() => scrollToSection('ratingSection')}
                                    className={styles.ratingAction}
                                >
                                    <Rating
                                        rating={rating.rating}
                                        showAverage
                                        underlineCount
                                        count={rating.count}
                                        inline
                                    />
                                </button>
                            )}
                        </div>
                        <ProductImageMain
                            productType={productType}
                            imageUrls={imageUrls}
                            isScreenPrintAppearance={isScreenPrintAppearance}
                        />
                        <div className={styles.mainDetails}>
                            {priceBlock}
                            <Appearances
                                productType={productType}
                                currentAppearance={currentAppearance}
                                selectedSize={selectedSize}
                            />
                            {availableSizes && (
                                <Sizes
                                    productType={productType}
                                    scrollToSection={scrollToSection}
                                    appearance={currentAppearance}
                                    selectedSize={selectedSize}
                                    setSelectedSize={setSelectedSize}
                                    sizeError={sizeError}
                                    setSizeError={setSizeError}
                                />
                            )}
                            {isStockOut ? (
                                <CTAStockOut>{t('assortment.outOfStock')}</CTAStockOut>
                            ) : !isPrintable && !isBlankVerboten ? (
                                <CTACart
                                    productType={productType}
                                    appearance={currentAppearance}
                                    quantity={selectedQuantity}
                                    price={formattedPrice}
                                    priceInfo={priceInfo}
                                    total={formattedTotalPrice}
                                    selectedSize={selectedSize}
                                    sizeError={sizeError}
                                    setSizeError={setSizeError}
                                />
                            ) : (
                                <CTA
                                    productType={productType}
                                    appearance={currentAppearance}
                                    quantity={selectedQuantity}
                                    price={formattedPrice}
                                    priceInfo={priceInfo}
                                    selectedSize={selectedSize}
                                />
                            )}
                            {deliveryETA ? (
                                <DeliveryInformation
                                    deliveryETA={deliveryETA}
                                    deliveryPrintTypeIds={deliveryPrintTypeIds}
                                    productTypeId={productType.id}
                                />
                            ) : null}
                            {isPrintable && (
                                <PriceCalculatorTrigger
                                    productType={productType}
                                    currentAppearance={currentAppearance}
                                    currency={currency}
                                    discounts={discounts}
                                    printAreaAmount={printAreaAmount}
                                    embroideryPrintAreaAmount={embroideryPrintAreaAmount}
                                />
                            )}
                            {isPrintable && !isBlankVerboten && (
                                <OrderSampleTrigger
                                    productType={productType}
                                    rating={rating}
                                    formattedSinglePrice={formattedSinglePrice}
                                    appearance={currentAppearance}
                                />
                            )}
                        </div>
                    </div>
                    <Collapse title={t('assortment.list.details')} first asHeading isOpenInitial>
                        <Columns collapseBelow="desktop" className={styles.productDetails}>
                            <Column width="1/2">
                                <div
                                    className={styles.description}
                                    dangerouslySetInnerHTML={{
                                        __html: productType.description,
                                    }}
                                />
                            </Column>
                            <Column width="1/2">
                                <Inline className={cn(justifyCenter, nowrap)} space={4}>
                                    <LoadingImage
                                        alt={productType.name}
                                        src={productTypeImageUrl(
                                            imageServerBase,
                                            productType.id,
                                            getDefaultViewId(productType),
                                            currentAppearanceId,
                                            {
                                                width: IMAGE_SIZE,
                                                height: IMAGE_SIZE,
                                                backgroundColor: 'f2f2f2',
                                            }
                                        )}
                                        width={IMAGE_SIZE}
                                        height={IMAGE_SIZE}
                                        lazy
                                    />
                                    {materialViewId ? (
                                        <LoadingImage
                                            alt={productType.name}
                                            src={productTypeImageUrl(
                                                imageServerBase,
                                                productType.id,
                                                materialViewId,
                                                currentAppearanceId,
                                                {
                                                    width: IMAGE_SIZE,
                                                    height: IMAGE_SIZE,
                                                    backgroundColor: 'f2f2f2',
                                                }
                                            )}
                                            width={IMAGE_SIZE}
                                            height={IMAGE_SIZE}
                                            lazy
                                        />
                                    ) : null}
                                </Inline>
                            </Column>
                        </Columns>
                    </Collapse>
                    {productType.sizes.some((size) => size.measures.length > 0) && (
                        <Collapse
                            ref={sizeTable}
                            title={t('sizePanel.sizeInfo')}
                            last={!showPrintTypesSection && !rating}
                            trackingId="size-section"
                            asHeading
                        >
                            <div className={styles.sizeLayoutBox}>
                                <SizeSection
                                    productType={productType}
                                    isPrintable={isPrintable}
                                    selectedSize={selectedSize}
                                />
                                {isPrintable && <DesignSizeRatio />}
                            </div>
                        </Collapse>
                    )}
                    {rating ? (
                        <Collapse
                            ref={ratingSection}
                            title={<RatingHeadline rating={rating} />}
                            last={!showPrintTypesSection}
                            trackingId="rating-section"
                            asHeading
                        >
                            <RatingSection ratingDetails={ratingDetails} productType={productType} />
                        </Collapse>
                    ) : null}
                    {showPrintTypesSection && (
                        <Collapse
                            title={t('printTypeInformation.Headline')}
                            last
                            trackingId="print-types-section"
                            asHeading
                        >
                            <PrintTypesInformation
                                currentAppearance={currentAppearance}
                                printTypes={printTypes}
                                printingOptions={productType.printingOptions}
                            />
                        </Collapse>
                    )}
                    {relatedProductTypes && relatedProductTypes.length ? (
                        <Stack space={12}>
                            <Text weight="strong">{t('assortment.detail.relatedProductsHeading')}</Text>
                            <Slider numberOfDisplayedItems={NUMBER_OF_DISPLAYED_ITEMS}>
                                {relatedProductTypes.map((relatedProductType) => (
                                    <RelatedProductType
                                        key={relatedProductType.id}
                                        productType={relatedProductType}
                                        currency={currency}
                                        quantity={selectedQuantity}
                                    />
                                ))}
                            </Slider>
                        </Stack>
                    ) : null}
                </Stack>
            </Page>
        </>
    );
};

const RedirectToAssortment: FunctionComponent<{ href: string }> = ({ href }) => {
    return (
        <Helmet>
            <link rel="canonical" href={href} />
        </Helmet>
    );
};

function isRedirected(props: PageProps): props is PdpRedirectProps {
    return (props as PdpRedirectProps).canonicalAssortment !== undefined;
}

const PdpPage: Page = (props) => {
    if (isRedirected(props)) {
        return <RedirectToAssortment href={props.canonicalAssortment} />;
    }

    if (!props.productType) {
        return <NotFound />;
    }

    return (
        <RouteContextProvider location={props.location}>
            <IntersectionObserverProvider>
                <Content {...props} key={props.productType.id} />
            </IntersectionObserverProvider>
        </RouteContextProvider>
    );
};

export default PdpPage;
