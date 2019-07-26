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
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  // Update the application state with the most recent list of todos.
  updateTodos(todos, isFirstLoad) {
    // Make setState accessible inside of setTimeout:
    const app = this;

    function updateState() {
      app.setState({
        todos: todos
      });
    }

    // Prevent loading screen from disappearing too fast.
    if (isFirstLoad) {
      setTimeout(updateState, 1500);
    } else {
      updateState();
    }

  }

  // Get the list of todos from the server.
  fetchTodos(isFirstLoad){
    // Make updateTodos() accessible inside of .then()
    const app = this;

    axios.get('http://localhost:3000/todos/')
      .then(function(response){
        var todos = response.data;
        app.updateTodos(todos, isFirstLoad);
      })
      .catch(app.handleError);

  }

  handleSuccess() {
    this.fetchTodos();
  }

  handleError(error) {
    alert('Oh no! There was an error with your request!');
    console.log(error);
  }

  addTodo(){
    // Make fetchTodos() available inside of .then()
    const app = this;
    const data = {
      text: "New todo"
    };

    axios.post('http://localhost:3000/todos/', data)
      .then(app.handleSuccess)
      .catch(app.handleError);
  }

  deleteTodo(id){
    // Make fetchTodos() available inside of .then()
    const app = this;

    axios.delete(`http://localhost:3000/todos/${id}`)
      .then(app.handleSuccess)
      .catch(app.handleError);
  }

  saveTodo(id, inputText) {
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
