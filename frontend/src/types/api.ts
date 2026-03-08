export type Project = {
    id: number;
    name: string;
};

export type ShotStatus =
    | 'not_started'
    | 'in_progress'
    | 'completed'
    | 'approved'
    | 'on_hold';

export type Shot = {
    id: number;
    name: string;
    status: ShotStatus;
    project: number;
};

export type PaginatedResponse<T> = {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
};