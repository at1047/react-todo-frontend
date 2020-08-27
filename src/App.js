import React, { Component } from 'react';
import axios from 'axios';
import { Label, FormGroup, Input, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const url = 'http://localhost:5000'

class App extends Component {
    state = {
        todos: [],
        newTodoModal: false,
        newTodoData: {
            todo_name: ""
        }
    }

    componentDidMount() {
        axios.get(`${url}/getTodo`)
            .then((res) => {
                this.setState({
                    todos: res.data
                })
                console.log(res)
            });
        ;
    }

    toggleNewTodoModal() {
        this.setState({
            newTodoModal: ! this.state.newTodoModal
        });
    }

    addTodo() {
        //const headers = {
            //'Access-Control-Allow-Origin': '*'
        //}
        axios.post(`${url}/createTodo`, this.state.newTodoData).then((res) => {
            let { todos } = this.state;
            todos.push(res.data)
            this.setState({
                todos,
                newTodoModal: false,
                newTodoData: {
                    todo_name: ""
                }
            });
        });
    }

    completeTodo(id) {
        axios({
            method: 'patch',
            url: `${url}/editTodo`,
            data: {
                "todo_id": id,
                "changes": {"status": true}
            }
        }).then((res) => {
            let newTodos = this.state.todos
            for (var i in newTodos) {
                if (newTodos[i].todo_id === id) {
                    newTodos[i].status = true
                }
            }
            this.setState({
                todos: newTodos
            })
        });
    }

    deleteTodo(id) {
        axios({
            method: 'delete',
            url: `${url}/deleteTodo`,
            data: {
                "todo_id": id
            }
        }).then((res) => {
            let newTodos = this.state.todos.filter( obj => obj.todo_id !== id)
            this.setState({
                todos: newTodos
            })
        });
    }

    render() {
        let todos = this.state.todos.map((todo) => {
            return (
                <tr key={todo.todo_id}>
                    <td>{todo.todo_id}</td>
                    <td>{todo.todo_name}</td>
                    <td>{ (todo.todo_attr)? 'none':(todo.todo_attr) }</td>
                    <td>{ (todo.status)? 'complete':'incomplete' }</td>
                    <td>
                        <Button color="success" size="sm" onClick={() => this.completeTodo(todo.todo_id)} className="mr-2">complete</Button>
                        <Button color="danger" size="sm" onClick={() => this.deleteTodo(todo.todo_id)}>delete</Button>
                    </td>
                </tr>
            )
        })
        return (
            <div className="App">
                <h1>Todo List App</h1>
                <Button className="m-2" color="primary" onClick={this.toggleNewTodoModal.bind(this)}>Add Todo</Button>
                <Modal isOpen={this.state.newTodoModal} toggle={this.toggleNewTodoModal.bind(this)}>
                    <ModalHeader toggle={this.toggleNewTodoModal.bind(this)}>Add new Todo</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="item">Item name</Label>
                            <Input id="name" value={this.state.newTodoData.todo_name} onChange={(e) => {
                                let { newTodoData } = this.state;
                                newTodoData.todo_name = e.target.value;
                                this.setState({ newTodoData });
                            }}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addTodo.bind(this)}>Add Todo</Button>{' '}
                        <Button color="secondary" onClick={this.toggleNewTodoModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Attributes</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos}
                    </tbody>
                </Table>
            </div>
          );
    }
}

export default App;
