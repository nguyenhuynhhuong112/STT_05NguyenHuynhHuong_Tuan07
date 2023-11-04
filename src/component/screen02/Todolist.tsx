import { View, Text, Pressable, FlatList } from "react-native";
import { TextInput } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { styles } from "./style";
import React, { useEffect, useState } from "react";

export const Todolist = ({navigation}) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);

  const getData = () => {
    fetch("https://654640dcfe036a2fa955674f.mockapi.io/todo/todos")
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        console.log("Data ", data);
      })
      .catch((error) => console.error("Error", error));
  };

  useEffect(() => {
    getData();
  }, [todos]);

  const renderItem = ({ item }: { item: any }) => {
    const deleteTodo = (id) => {
      console.log("id ", id);
      fetch(`https://654640dcfe036a2fa955674f.mockapi.io/todo/todos/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            const updatedTodos = todos.filter((todo) => todo.id !== id);
            setTodos(updatedTodos);
          } else {
            console.error("Không thể xóa todo.");
          }
        })
        .catch((error) => {
          console.error("Lỗi", error);
        });
    };

    const updateTodo = (id) => {
      console.log("id ", id);
      console.log("todo update: ", editTodo);
      const updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, todos: editTodo };
        }
        return todo;
      });
      fetch(`https://654640dcfe036a2fa955674f.mockapi.io/todo/todos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todos: editTodo }),
      }).then((response)=>{
        if (response.ok) {
            setTodos(updatedTodos);
          } else {
            console.error("Lỗi khi cập nhật công việc.");
          }
      })
      setEditingItemId(null);
    };

    return (
      <View style={styles.todo}>
        <Pressable onPress={() => deleteTodo(item.id)}>
          <Ionicons
            name="checkmark-done-circle-outline"
            size={30}
            style={styles.checkDone}
          />
        </Pressable>
        <TextInput
          value={editingItemId === item.id ? editTodo : item.todos}
          style={styles.content}
          underlineColor="transparent"
          theme={{ colors: { primary: "transparent" } }}
          onChangeText={(text) => setEditTodo(text)}
          onFocus={() => setEditingItemId(item.id)}
          onBlur={() => setEditingItemId(null)}
        />
        <Pressable
          onPress={() => {
            updateTodo(item.id);
          }}
        >
          <AntDesign name="edit" size={25} style={styles.edit} />
        </Pressable>
      </View>
    );
  };

  const addTodo = () => {
    // console.log("todo ", newTodo);
    // const newTodoItem = {
    //   name: "Huỳnh Hương",
    //   todos: newTodo,
    // };
    // fetch("https://654640dcfe036a2fa955674f.mockapi.io/todo/todos", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newTodoItem),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     getData();
    //     setNewTodo("");
    //   })
    //   .catch((error) => {
    //     console.error("Lỗi", error);
    //   });
    navigation.navigate('add')
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.inputSearch}
          underlineColor="transparent"
          theme={{ colors: { primary: "transparent" } }}
          placeholder="Search"
          value={newTodo}
          onChangeText={(text) => setNewTodo(text)}
        />
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.add}>
          <Pressable style={styles.buttonAdd} onPress={addTodo}>
            <Ionicons name="add" size={20} style={styles.iconAdd} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};
