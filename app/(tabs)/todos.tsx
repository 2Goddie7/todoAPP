// app/(tabs)/todos.tsx
import { useTodos } from "@/src/presentation/hooks/useTodos";
import { createStyles, defaultLightTheme, defaultDarkTheme } from "@/src/presentation/styles/todos.styles";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
 
export default function TodosScreenClean() {
  const [inputText, setInputText] = useState("");
  const { todos, loading, addTodo, toggleTodo, deleteTodo } = useTodos();
 
  const colorScheme = useColorScheme();
  const styles = useMemo(
    () => createStyles(colorScheme === 'dark' ? defaultDarkTheme : defaultLightTheme),
    [colorScheme]
  );
 
  const handleAddTodo = async () => {
    if (!inputText.trim()) return;
 
    const success = await addTodo(inputText);
    if (success) {
      setInputText("");
    }
  };

  const handleDeleteTodo = (id: string, title: string) => {
    console.log(`🚨 Delete button pressed for: ${title} (id: ${id}, type: ${typeof id})`);
    
    Alert.alert(
      "Eliminar tarea",
      `¿Estás seguro de eliminar "${title}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            console.log(`✅ User confirmed deletion of ${id}`);
            deleteTodo(id);
          }
        }
      ]
    );
  };
 
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator
          size="large"
          color={colorScheme === 'dark' ? defaultDarkTheme.primary : defaultLightTheme.primary}
        />
        <Text style={styles.loadingText}>Cargando tareas...</Text>
      </View>
    );
  }
 
  const renderTodo = ({ item }: { item: any }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.todoContent}
        onPress={() => {
          console.log(`Toggle pressed for: ${item.title} (id: ${item.id})`);
          toggleTodo(item.id);
        }}
      >
        <View
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[styles.todoText, item.completed && styles.todoTextCompleted]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleDeleteTodo(item.id, item.title)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tareas</Text>
 
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nueva tarea..."
          placeholderTextColor={colorScheme === 'dark' ? defaultDarkTheme.placeholder : defaultLightTheme.placeholder}
          onSubmitEditing={handleAddTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
 
      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => {
          console.log(`Key for item: ${item.title} = ${item.id} (type: ${typeof item.id})`);
          return String(item.id);
        }}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
 
      <Text style={styles.footer}>
        Total: {todos.length} | Completadas:{" "}
        {todos.filter((t) => t.completed).length}
      </Text>
    </View>
  );
}