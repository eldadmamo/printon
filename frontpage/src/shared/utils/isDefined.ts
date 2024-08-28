export const isDefined = <DefinedType>(
    unknown: DefinedType | undefined | null
): unknown is DefinedType => unknown != null;
