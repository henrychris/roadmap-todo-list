import type { SortOrder } from "mongoose";

export interface PaginationOptions {
    pageNo: number;
    pageSize: number;
}

export interface SortOptions {
    [key: string]: { [key: string]: SortOrder };
}

export interface Filters {
    user: string;
    createdAt?: {
        $gte?: Date;
        $lte?: Date;
    };
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
}
