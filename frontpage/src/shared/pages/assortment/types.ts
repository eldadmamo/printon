export interface AssortmentPageParams {
    sort?: string; // The sorting parameter, e.g., 'price-asc', 'price-desc', etc.
    category?: string; // The category ID of the products to filter.
    categoryId: string;
    subcategory?: string;
    searchQuery?: string;
    search?: string;
    sortBy: 'price' | 'popularity' | 'newest';
    page?: number;
    filters?: {
        [key: string]: string | number | boolean;
    };
    department?: string; // The department ID to filter products.
    size?: string;
    appearance?: string; // The appearance group to filter products.
    brand?: string;// The brand ID to filter products.
    materials?: string;
    maxPrice?: string; // The maximum price to filter products.
    refinement?: string; // Refinement type to filter products.
    fit?: string; // The fit parameter to filter products.
    style?: string; // The style parameter to filter products.
    neckline?: string; // The neckline type to filter products.
    sleeve?: string; // The sleeve type to filter products.
    feature?: string; // Any additional features to filter products, e.g., sustainable.
    quantity?: number; // Quantity of the products.
}
