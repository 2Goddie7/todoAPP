// Contrato: Define QUE operaciones existen no COMO se implementan.

import { Todo, CreateTodoDTO, UpdateTodoDTO } from "../entities/Todo";

export interface TodoRepository{
    getAall(): Promise<Todo[]>;
    getById(id:string):Promise<Todo | null>;
    create(Todo: CreateTodoDTO):Promise<Todo>;
    update(Todo: UpdateTodoDTO):Promise<Todo>;
    delete(id:string):Promise<void>;
}