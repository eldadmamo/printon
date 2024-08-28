export const hasOwnProperty = (object: any, property: string) =>
    Object.prototype.hasOwnProperty.call(object,property);