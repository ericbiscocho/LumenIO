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

export type TaskStatus =
    | 'todo'
    | 'in_progress'
    | 'review'
    | 'done';

export type Task = {
    id: number;
    name: string;
    status: TaskStatus;
    shot: number;
}

export type PaginatedResponse<T> = {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
};