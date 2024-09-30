export interface CreateTodoRequest {
    title: string;
    description: string;
}

export interface UpdateTodoRequest {
    title?: string;
    description?: string;
}
