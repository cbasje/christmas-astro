// From https://gist.github.com/rphlmr/0d1722a794ed5a16da0fdf6652902b15

import {
    type AnyColumn,
    type GetColumnData,
    type SQL,
    is,
    sql,
} from "drizzle-orm";
import {
    type PgColumn,
    PgTimestampString,
    type SelectedFields,
} from "drizzle-orm/pg-core";
import type { SelectResultFields } from "drizzle-orm/query-builders/select.types";
import { coalesce } from "./coalesce";

export function jsonBuildObject<T extends SelectedFields>(shape: T) {
    const chunks: SQL[] = [];

    for (const [key, value] of Object.entries(shape)) {
        if (chunks.length > 0) {
            chunks.push(sql.raw(","));
        }

        chunks.push(sql.raw(`'${key}',`));

        // json_build_object formats to ISO 8601 ...
        if (is(value, PgTimestampString)) {
            chunks.push(sql`timezone('UTC', ${value})`);
        } else {
            chunks.push(sql`${value}`);
        }
    }

    return sql<SelectResultFields<T>>`json_build_object(${sql.join(chunks)})`;
}

export function jsonAggBuildObject<
    T extends SelectedFields,
    Column extends AnyColumn,
>(
    shape: T,
    options?: { orderBy?: { colName: Column; direction: "ASC" | "DESC" } },
) {
    return sql<SelectResultFields<T>[]>`coalesce(
	  json_agg(${jsonBuildObject(shape)} ${
          options?.orderBy
              ? sql`ORDER BY ${options.orderBy.colName} ${sql.raw(options.orderBy.direction)}`
              : undefined
      }), '${sql`[]`}')`;
}

export function jsonAgg<Column extends AnyColumn>(column: Column) {
    return coalesce<GetColumnData<Column, "raw">[]>(
        sql`json_agg(${sql`${column}`})`,
        sql`'[]'`,
    );
}

export function pickJsonbField<
    U,
    K extends keyof U,
    T extends PgColumn = PgColumn,
>(column: T, field: K, cast?: "uuid") {
    return sql<
        U[K]
    >`((${column}->${field})${cast ? sql.raw(`::${cast}`) : undefined})`;
}
