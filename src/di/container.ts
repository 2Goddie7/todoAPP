// src/di/container.ts
import { FirebaseTodoDataSource } from '@/src/data/datasources/FirebaseTodoDataSource';
import { TodoRepositoryFirebaseImpl } from '@/src/data/repositories/TodoRepositoryFirebaseImpl';
import { GetAllTodos } from '@/src/domain/usecases/GetAllTodo';
import { CreateTodo } from '@/src/domain/usecases/CreateTodo';
import { ToogleTodo } from '@/src/domain/usecases/ToogleTodo';
import { DeleteTodo } from '@/src/domain/usecases/DeleteTodo';
 
class DIContainer {
  private static instance: DIContainer;
  private _dataSource: FirebaseTodoDataSource | null = null;
  private _repository: TodoRepositoryFirebaseImpl | null = null;
  private _initialized: boolean = false;
  private _initPromise: Promise<void> | null = null;
 
  private constructor() {}
 
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }
 
  // ✅ Mejorado: Prevenir múltiples inicializaciones
  async initialize(): Promise<void> {
    // Si ya está inicializado, no hacer nada
    if (this._initialized) {
      console.log("⚠️ Container already initialized, skipping...");
      return;
    }

    // Si ya hay una inicialización en progreso, esperar a que termine
    if (this._initPromise) {
      console.log("⏳ Waiting for existing initialization...");
      return this._initPromise;
    }

    // Crear la promesa de inicialización
    this._initPromise = this._doInitialize();
    await this._initPromise;
  }

  private async _doInitialize(): Promise<void> {
    try {
      console.log("🚀 Initializing DI Container...");
      this._dataSource = new FirebaseTodoDataSource();
      await this._dataSource.initialize();
      this._repository = new TodoRepositoryFirebaseImpl(this._dataSource);
      this._initialized = true;
      console.log("✅ DI Container initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize DI Container:", error);
      // Limpiar el estado en caso de error
      this._dataSource = null;
      this._repository = null;
      this._initPromise = null;
      throw error;
    }
  }
 
  // ✅ Mejorado: Verificación más clara
  private ensureInitialized(): void {
    if (!this._initialized || !this._repository) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
  }

  get getAllTodos(): GetAllTodos {
    this.ensureInitialized();
    return new GetAllTodos(this._repository!);
  }
 
  get createTodo(): CreateTodo {
    this.ensureInitialized();
    return new CreateTodo(this._repository!);
  }
 
  get toggleTodo(): ToogleTodo {
    this.ensureInitialized();
    return new ToogleTodo(this._repository!);
  }
 
  get deleteTodo(): DeleteTodo {
    this.ensureInitialized();
    console.log("🔧 Creating DeleteTodo use case");
    return new DeleteTodo(this._repository!);
  }

  // ✅ Método útil para debugging
  get isInitialized(): boolean {
    return this._initialized;
  }
}
 
export const container = DIContainer.getInstance();