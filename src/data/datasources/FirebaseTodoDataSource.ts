// src/data/datasources/FirebaseTodoDataSource.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/FirebaseConfig"; // ✅ Ahora db es Firestore
import { Todo } from "@/src/domain/entities/Todo";
 
export class FirebaseTodoDataSource {
  private collectionName = "todos";
 
  async initialize(): Promise<void> {
    console.log("✅ Firebase Firestore initialized");
    // Verificar que db esté funcionando
    try {
      const testQuery = query(collection(db, this.collectionName));
      await getDocs(testQuery);
      console.log("✅ Firestore connection successful");
    } catch (error) {
      console.error("❌ Firestore connection failed:", error);
      throw error;
    }
  }
 
  async getAllTodos(): Promise<Todo[]> {
    try {
      console.log("📥 Fetching todos from Firestore...");
      const q = query(
        collection(db, this.collectionName),
        orderBy("createdAt", "desc")
      );
 
      const querySnapshot = await getDocs(q);
      console.log(`✅ Found ${querySnapshot.docs.length} todos`);
 
      return querySnapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          title: data.title,
          completed: data.completed,
          createdAt: data.createdAt.toDate(),
        };
      });
    } catch (error) {
      console.error("❌ Error fetching todos:", error);
      throw error;
    }
  }
 
  async getTodoById(id: string): Promise<Todo | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
 
      if (!docSnap.exists()) {
        console.log(`⚠️ Todo with id ${id} not found`);
        return null;
      }
 
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        completed: data.completed,
        createdAt: data.createdAt.toDate(),
      };
    } catch (error) {
      console.error("❌ Error fetching todo by id:", error);
      throw error;
    }
  }
 
  async createTodo(title: string): Promise<Todo> {
    try {
      console.log(`📝 Creating todo: "${title}"`);
      
      const newTodo = {
        title,
        completed: false,
        createdAt: Timestamp.now(),
      };
 
      const docRef = await addDoc(collection(db, this.collectionName), newTodo);
      console.log(`✅ Todo created with id: ${docRef.id}`);
 
      return {
        id: docRef.id,
        title,
        completed: false,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("❌ Error creating todo:", error);
      throw error;
    }
  }
 
  async updateTodo(
    id: string,
    completed?: boolean,
    title?: string
  ): Promise<Todo> {
    try {
      console.log(`📝 Updating todo ${id}`);
      const docRef = doc(db, this.collectionName, id);
 
      const updates: any = {};
      if (completed !== undefined) updates.completed = completed;
      if (title !== undefined) updates.title = title;
 
      await updateDoc(docRef, updates);
      console.log(`✅ Todo ${id} updated`);
 
      const updated = await this.getTodoById(id);
      if (!updated) throw new Error("Todo not found after update");
 
      return updated;
    } catch (error) {
      console.error("❌ Error updating todo:", error);
      throw error;
    }
  }
 
  async deleteTodo(id: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting todo with id: "${id}" (type: ${typeof id})`);
      
      // Verificar que el ID no esté vacío
      if (!id || id.trim() === '') {
        throw new Error('Invalid todo ID: empty or undefined');
      }
      
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      console.log(`✅ Todo ${id} deleted successfully`);
    } catch (error) {
      console.error("❌ Error deleting todo:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  }
}