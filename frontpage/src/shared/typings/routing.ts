// Interface for route definitions
export interface RouteDefinition {
    key: string; // Unique key for the route
    component: {
        paramsFromLocation: (path: string, queryParams: Record<string, any>) => RoutableComponentParams; // Method to parse params from the URL
    };
}

// Type for routable component parameters
export type RoutableComponentParams = Record<string, any>;
