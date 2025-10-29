import { TodoRepository } from "../repositores/TodoRepository";
import { Todo } from "../entities/Todo";


export class GetAllTodos{
    constructor(private repository: TodoRepository){}

    async execute(): Promise<Todo[]>{
        return await this.repository.getAall();
    }
}