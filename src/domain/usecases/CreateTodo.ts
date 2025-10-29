import { Todo, CreateTodoDTO } from "../entities/Todo";
import { TodoRepository } from "../repositores/TodoRepository";

export class CreateTodo {
    constructor(private repository: TodoRepository){}

    async execute (data: CreateTodoDTO):Promise<Todo>{
        //Aqui se pueden agregar validaciones de negocio
        if(!data.title.trim){
            throw new Error("El titulo no puede estar vacio");
        }

        if (data.title.length > 200){
            throw new Error("El titulo es demasiado largo");
        }

        return await this.repository.create(data);
    }
}