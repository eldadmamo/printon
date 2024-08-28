import { AssortmentPageParams } from '../pages/assortment/types';
import { transformToUrl } from './urls';

const departmentIdToGenderMapping = {
    EU: {
        '1': 'MEN',
        '3': 'WOMEN',
        '4': 'KIDS',
        '5': 'UNISEX',
    },
    NA: {
        '1': 'MEN',
        '2': 'WOMEN',
        '3': 'KIDS',
        '5': 'UNISEX',
    },
} as const;

const genderIdToDepartmentIdMapping = {
    EU: { MEN: '1', WOMEN: '3', KIDS: '4', UNISEX: '5' },
    NA: { MEN: '1', WOMEN: '2', KIDS: '3', UNISEX: '5' },
} as const;

export const mapDepartmentToGender = (department: string, platform: string) =>
    departmentIdToGenderMapping[platform][department];

export const mapGenderIdToDepartmentId = (id: string, platform) => {
    return `D${genderIdToDepartmentIdMapping[platform][id]}`;
};

export const getCategoryById = (
    categoryId: string,
    categories: AssortmentListCategoryFilter[]
): AssortmentListCategoryFilter | null => {
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].id === categoryId) {
            return categories[i];
        }

        if (categories[i].children && categories[i].children.length) {
            const result = getCategoryById(categoryId, categories[i].children);
            if (result) {
                return result;
            }
        }
    }

    return null;
};

export const getFilterById = <FilterType extends SimpleAssortmentFilter>(
    filters: FilterType[],
    filterId: string
) => filters.find((f) => f.id === filterId);

export const getGenderById = (filter: AssortmentListFilter, genderId: string) =>
    getFilterById(filter.gender, genderId);

export const getDepartmentById = (
    filter: AssortmentListFilter,
    departmentId: string,
    platform: GlobalData['platform']
) => getGenderById(filter, mapDepartmentToGender(departmentId.replace('D', ''), platform));

export interface ActiveAssortmentFilters {
    category?: AssortmentListCategoryFilter;
    department?: SimpleAssortmentFilter;
    size?: SimpleAssortmentFilter;
    appearance?: AppearanceGroupAssortmentFilter;
    feature?: SimpleAssortmentFilter;
    brand?: SimpleAssortmentFilter;
    refinement?: SimpleAssortmentFilter;
    materials?: SimpleAssortmentFilter;
    fit?: SimpleAssortmentFilter;
    style?: SimpleAssortmentFilter;
    neckline?: SimpleAssortmentFilter;
    sleeve?: SimpleAssortmentFilter;
}

export const getActiveFilters = (
    params: AssortmentPageParams,
    filter: AssortmentListFilter,
    platform: GlobalData['platform']
): ActiveAssortmentFilters => ({
    category: params.category ? getCategoryById(params.category, filter.categories) : null,
    department: params.department ? getDepartmentById(filter, params.department, platform) : null,
    size: params.size ? getFilterById(filter.sizes, params.size) : null,
    appearance: params.appearance ? getFilterById(filter.appearanceGroups, params.appearance) : null,
    feature: params.feature ? getFilterById(filter.features, params.feature) : null,
    brand: params.brand ? getFilterById(filter.brand, params.brand) : null,
    refinement: params.refinement ? getFilterById(filter.refinement, params.refinement) : null,
    materials: params.materials ? getFilterById(filter.materials, params.materials) : null,
    fit: params.fit ? getFilterById(filter.fit, params.fit) : null,
    style: params.style ? getFilterById(filter.style, params.style) : null,
    neckline: params.neckline ? getFilterById(filter.neckline, params.neckline) : null,
    sleeve: params.sleeve ? getFilterById(filter.sleeve, params.sleeve) : null,
});

export const getHasAvailableOptions = (filter: SimpleAssortmentFilter[]) => {
    return filter.some((option) => option.available);
};

const getOrderedCategoryAndDepartment = (
    { department, category }: ActiveAssortmentFilters,
    language: string
) => {
    const categoryAndDepartment = [];

    if (department) {
        categoryAndDepartment.push(department.translation);
    }

    if (category) {
        categoryAndDepartment.push(category.translation);
    }

    switch (language) {
        case 'en':
            if (department && category) {
                categoryAndDepartment[0] += department.translation.endsWith('s') ? "'" : "'s";
            }
            break;
        case 'fr':
            categoryAndDepartment.reverse();
            break;
    }

    return categoryAndDepartment;
};

const getOrderedAdditionalFilters = ({ feature, appearance, size }: ActiveAssortmentFilters) => {
    const additionalFilters = [];

    if (feature) {
        additionalFilters.push(feature.translation);
    }

    if (appearance) {
        additionalFilters.push(appearance.translation);
    }

    if (size) {
        additionalFilters.push(size.translation);
    }

    return additionalFilters;
};

export const getPageTitle = (selectedFilters: ActiveAssortmentFilters, language: string) => {
    const categoryAndDepartments = getOrderedCategoryAndDepartment(selectedFilters, language).join(
        ' - '
    );
    const additionalFilters = getOrderedAdditionalFilters(selectedFilters).join(' - ');

    if (additionalFilters) {
        if (categoryAndDepartments) {
            return `${categoryAndDepartments} | ${additionalFilters}`;
        }

        return additionalFilters;
    }

    if (categoryAndDepartments) {
        return categoryAndDepartments;
    }
};

export const getPageHeadline = (selectedFilters: ActiveAssortmentFilters, language: string) =>
    getOrderedCategoryAndDepartment(selectedFilters, language).join(' ');

export const getSeoUrlPart = (activeFilters: ActiveAssortmentFilters) => {
    const seoStrings = [];

    if (activeFilters.department) {
        seoStrings.push(activeFilters.department.translation.toLowerCase());
    }

    if (activeFilters.category) {
        seoStrings.push(activeFilters.category.translation.toLowerCase());
    }

    if (activeFilters.feature) {
        seoStrings.push(activeFilters.feature.translation.toLowerCase());
    }

    if (activeFilters.appearance) {
        seoStrings.push(activeFilters.appearance.translation.toLowerCase());
    }

    if (activeFilters.size) {
        seoStrings.push(activeFilters.size.translation.toLowerCase());
    }
    return seoStrings.map(transformToUrl).join('-');
};

const landingPageMapping = {
    CG01: 'productTypesTShirt',
    CG02: 'productTypesHoodie',
    CG03: 'productTypesLongSleeve',
    CG04: 'productTypesTankTop',
    CG05: 'productTypesOverview',
    CG06: 'productTypesPoloShirt',
    CG07: 'productTypesSportswear',
    CG08: 'productTypesSportswear',
    CG09: 'productTypesUnderwear',
    CG10: 'productTypesBabyClothing',
    CG11: 'productTypesHat',
    CG12: 'productTypesBag',
    CG13: 'productTypesIphoneCase',
    CG14: 'productTypesSamsungCase',
    CG15: 'productTypesOverview',
    CG16: 'productTypesOverview',
    CG17: 'productTypesMug',
    CG18: 'productTypesApron',
    CG19: 'productTypesButton',
    CG21: 'productTypesTeddy',
    CG22: 'productTypesUmbrella',
    CG23: 'productTypesPillowcase',
    CG24: 'productTypesOverview',
    CG25: 'productTypesOverview',
};

export const getSeoLandingPageForCategory = (categoryId: string): string | undefined =>
    landingPageMapping[categoryId];

// because tracking does a deep-merge we must make sure that unset params are set to null
export const mapFilterParamsForTracking = (params: AssortmentPageParams): AssortmentPageParams => ({
    category: null,
    department: null,
    feature: null,
    size: null,
    appearance: null,
    sort: null,
    brand: null,
    refinement: null,
    materials: null,
    fit: null,
    neckline: null,
    sleeve: null,
    style: null,
    ...params,
});
