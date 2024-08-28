export const toggleArrayItem = <ItemType>(array: ItemType[], item: ItemType): ItemType[] => {
    const index = array.indexOf(item);
    return index === -1 ? [...array, item] : [...array.slice(0, index), ...array.slice(index + 1)];
};
