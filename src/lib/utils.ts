export const capitaliseString = ([first, ...rest]: string) =>
    `${first.toUpperCase()}${rest.join("").toLowerCase()}`;
