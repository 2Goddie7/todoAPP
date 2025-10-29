// src/domain/usecases/DeleteTodo.ts
import { TodoRepository } from "../repositores/TodoRepository";

export class DeleteTodo {
    constructor(private repository: TodoRepository) {}

    async execute(id: string): Promise<void> {
        console.log(`🎯 UseCase DeleteTodo: Executing for id "${id}" (type: ${typeof id})`);
        
        // Validación
        if (!id || id.trim() === '') {
            const error = new Error("ID de tarea inválido");
            console.error("❌ UseCase DeleteTodo: Invalid ID", error);
            throw error;
        }

        try {
            await this.repository.delete(id);
            console.log(`✅ UseCase DeleteTodo: Successfully deleted ${id}`);
        } catch (error) {
            console.error(`❌ UseCase DeleteTodo: Failed to delete ${id}`, error);
            throw error;
        }
    }
}