const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;

export const formatDate = (
    input: Date,
    type?: "relative" | "literal",
    options?: Intl.RelativeTimeFormatOptions | Intl.DateTimeFormatOptions,
) => {
    if (type === "relative") {
        const diffMillis = input.valueOf() - Date.now();
        const formatter = new Intl.RelativeTimeFormat(undefined, {
            numeric: "auto",
            style: "narrow",
            ...options,
        });

        if (Math.abs(diffMillis) <= hour) {
            return formatter.format(Math.round(diffMillis / minute), "minute");
        }
        if (Math.abs(diffMillis) <= day) {
            return formatter.format(Math.round(diffMillis / hour), "hour");
        }
        if (Math.abs(diffMillis) <= week) {
            return formatter.format(Math.round(diffMillis / day), "day");
        }
    }

    const formatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        ...options,
    });
    return formatter.format(input);
};

export const formatDateRange = (
    input: {
        start: Date;
        end: Date;
    },
    options?: Intl.RelativeTimeFormatOptions | Intl.DateTimeFormatOptions,
) => {
    const formatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        ...options,
    });
    return formatter.formatRange(input.start, input.end);
};
