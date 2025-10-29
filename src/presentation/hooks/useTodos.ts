// src/presentation/hooks/useTodos.ts
import { container } from "@/src/di/container";
import { Todo } from "@/src/domain/entities/Todo";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
 
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const loadTodos = useCallback(async () => {
    try {
      console.log("🔄 Loading todos...");
      setLoading(true);
      setError(null);
      const result = await container.getAllTodos.execute();
      console.log(`✅ Loaded ${result.length} todos`);
      setTodos(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      console.error("❌ Error loading todos:", message);
      setError(message);
      Alert.alert("Error", "No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);
 
  const addTodo = async (title: string): Promise<boolean> => {
    try {
      console.log(`➕ Adding todo: "${title}"`);
      const newTodo = await container.createTodo.execute({ title });
      console.log(`✅ Todo created:`, newTodo);
      
      // Agregar al principio de la lista
      setTodos([newTodo, ...todos]);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al agregar tarea";
      console.error("❌ Error adding todo:", message, err);
      Alert.alert("Error", message);
      return false;
    }
  };
 
  const toggleTodo = async (id: string): Promise<void> => {
    try {
      console.log(`🔄 Toggling todo: ${id}`);
      const updatedTodo = await container.toggleTodo.execute(id);
      console.log(`✅ Todo toggled:`, updatedTodo);
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (err) {
      console.error("❌ Error toggling todo:", err);
      Alert.alert("Error", "No se pudo actualizar la tarea");
    }
  };
 
  const deleteTodo = async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Deleting todo: ${id}`);
      await container.deleteTodo.execute(id);
      console.log(`✅ Todo deleted: ${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error("❌ Error deleting todo:", err);
      Alert.alert("Error", "No se pudo eliminar la tarea");
    }
  };
 
  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    refresh: loadTodos,
  };
};