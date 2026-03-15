import { useEffect, useState } from 'react';
import api from '../api/client';
import type { Task, TaskStatus, PaginatedResponse } from '../types/api';

type TasksProps = {
    shotId: number;
}

export default function Tasks({ shotId }: TasksProps) {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        api.get<PaginatedResponse<Task>>(`tasks/?shot=${shotId}`).then((response) => {
            setTasks(response.data.results);
        });
    }, [shotId]);

    return (
    <div>
        <ul>
        {tasks.map((task) => (
            <li key={task.id} style={{ display: "flex", gap: "12px" }}>
            <span>{task.name}</span>
            <select
                value={task.status}
                onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                const response = await api.patch<Task>(`tasks/${task.id}/`, {
                    status: e.target.value as TaskStatus,
                });

                setTasks((prevStatus) =>
                    prevStatus.map((taskStatus) =>
                    taskStatus.id === task.id ? response.data : taskStatus
                    )
                );
                }}
            >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
            </select>
            </li>
        ))}
        </ul>
    </div>
  );
}