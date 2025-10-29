import { TodoRepository } from "../repositores/TodoRepository";

export class DeleteTodo{
    constructor(private repository: TodoRepository){}

    async execute (id:string): Promise<void>{
        await this.repository.delete(id);
    }
}