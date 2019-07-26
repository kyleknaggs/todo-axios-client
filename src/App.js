import React, { Component } from 'react';
import axios from 'axios';
import Background from './components/Background';
import TodoList from './components/TodoList';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      todos: [
        {
          id: 0,
          text: "Loading..."
        }
      ]
    };
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.saveTodo = this.saveTodo.bind(this);
  }

  handleError(error){
    alert('Oh no! There was an error with your request!');
    console.log(error);
  }

  // Get the list of todos from the server.
  fetchTodos(isFirstLoad){
    // Make loadTodos() accessible inside of .then()
    const app = this;

    axios.get('http://localhost:3000/todos/')
      .then(function(response){
        var todos = response.data;
        app.loadTodos(todos, isFirstLoad);
      })
      .catch(app.handleError);

  }

  // Update the application state with the most recent list of todos.
  loadTodos(todos, isFirstLoad) {
    // Make setState accessible inside of setTimeout:
    const app = this;

    function updateState(){
      app.setState({
        todos: todos
      });
    }

    // Prevent loading screen from disappearing too fast.
    if(isFirstLoad){
      setTimeout(updateState, 1500);
    }else{
      updateState();
    }

  }

  addTodo(){
    // Make fetchTodos() available inside of .onload()
    const app = this;
    const data = {
      text: "New todo"
    };

    axios.post('http://localhost:3000/todos/', data)
      .then(function(){
        app.fetchTodos();
      })
      .catch(app.handleError);
  }

  deleteTodo(id){
    // Make fetchTodos() available inside of .onload()
    const app = this;
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
      // If todo was deleted successfully, fetch the remaining todos
      if (this.status === 200) {
        app.fetchTodos();
      }
    }

    xhr.open("DELETE", `http://localhost:3000/todos/${id}`);
    xhr.send()
  }

  saveTodo(id, inputText){
    // Make fetchTodos() available inside of .onload()
    const app = this;
    const xhr = new XMLHttpRequest();
    const data = JSON.stringify({
      text: inputText
    });

    xhr.onload = function () {
      // Once todo has been added get new list of todos
      if (this.status === 200) {
        app.fetchTodos();
      }
    }

    xhr.open("PUT", `http://localhost:3000/todos/${id}`);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
  }

  // Lifecycle methods:
  componentDidMount() {
    this.fetchTodos(true);
  }

  render(){
    const { addTodo, deleteTodo, saveTodo, state: {todos} } = this;

    return (
      <Background>
        <TodoList
          addTodo={addTodo}
          deleteTodo={deleteTodo}
          saveTodo={saveTodo}
          todos={todos}
        />
      </Background>
    );
  }
}

export default App;
