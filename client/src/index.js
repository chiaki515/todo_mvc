import React from "react"
import ReactDOM from "react-dom"
import "./index.css"

const todos = []

const TodoHeader = props => {
  const remaining = props.todos.filter(todo => {
    return !todo.isDone
  })
  return (
    <h1>
      My Todos<span>
        ({remaining.length}/{props.todos.length})
      </span>
    </h1>
  )
}

const TodoFooter = props => (
  <h2>
    <p className="line" />
    <button className="change-mode" onClick={() => props.modeChange("all")}>
      All
    </button>
    <button className="change-mode" onClick={() => props.modeChange("active")}>
      Active
    </button>
    <button
      className="change-mode"
      onClick={() => props.modeChange("completed")}
    >
      Completed
    </button>
    <button className="clear-completed" onClick={props.purge}>
      Clear Completed
    </button>
  </h2>
)

const TodoItem = props => (
  <li>
    <label>
      <input
        className="option-checkbox"
        type="checkbox"
        checked={props.todo.isDone}
        onChange={() => props.checkTodo(props.todo)}
      />
      <span className={props.todo.isDone ? "done" : ""}>{props.todo.text}</span>
    </label>
    <span className="cmd" onClick={() => props.deleteTodo(props.todo)}>
      [x]
    </span>
  </li>
)

const TodoList = props => {
  let todos_mode = props.todos

  if (props.mode == "all") {
    //何もしない
  } else if (props.mode == "active") {
    todos_mode = todos_mode.filter(todo => {
      return !todo.isDone
    })
  } else if (props.mode == "completed") {
    todos_mode = todos_mode.filter(todo => {
      return todo.isDone
    })
  }

  const todos = todos_mode.map(todo => {
    return (
      <TodoItem
        key={todo.id}
        todo={todo}
        checkTodo={props.checkTodo}
        deleteTodo={props.deleteTodo}
      />
    )
  })

  return <ul>{props.todos.length ? todos : <li>Nothing Todo</li>}</ul>
}

const TodoForm = props => (
  <form onSubmit={props.addTodo}>
    <input type="text" value={props.item} onChange={e => props.updateItem(e)} />{" "}
  </form>
)

const getUniqueId = () =>
  new Date().getTime().toString(36) + "-" + Math.random().toString(36) //適当なID

export class App extends React.Component {
  constructor() {
    super()
    this.state = {
      todos: todos,
      item: "",
      mode: "all"
    }
    this.checkTodo = this.checkTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
    this.updateItem = this.updateItem.bind(this)
    this.addTodo = this.addTodo.bind(this)
    this.purge = this.purge.bind(this)
    this.modeChange = this.modeChange.bind(this)
  }

  checkTodo(todo) {
    const todos = this.state.todos.map(todo => {
      return { id: todo.id, text: todo.text, isDone: todo.isDone }
    })

    const pos = this.state.todos
      .map(todo => {
        return todo.id
      })
      .indexOf(todo.id)

    todos[pos].isDone = !todos[pos].isDone
    this.setState({ todos: todos })
  }

  deleteTodo(todo) {
    // if (!confirm("削除しますか?")) {
    //   return
    // }
    const todos = this.state.todos.slice()
    const pos = this.state.todos.indexOf(todo)

    todos.splice(pos, 1)
    this.setState({ todos: todos })
  }

  updateItem(e) {
    this.setState({ item: e.target.value })
  }

  componentDidUpdate() {
    localStorage.setItem("todos", JSON.stringify(this.state.todos)) //保存
  }

  componentDidMount() {
    this.setState({
      todos: JSON.parse(localStorage.getItem("todos")) || []
    })
  }

  addTodo(e) {
    e.preventDefault() //ページ遷移を防ぐ

    //空白エラー
    if (this.state.item.trim() === "") {
      return
    }
    const item = { id: getUniqueId(), text: this.state.item, isDone: false }

    const todos = this.state.todos.slice()
    todos.push(item)
    this.setState({
      todos: todos,
      item: "" //文字を消す
    })
  }

  purge() {
    const todos = this.state.todos.filter(todo => {
      return !todo.isDone
    })
    this.setState({ todos: todos })
  }

  modeChange(mode) {
    if (mode == "all") {
      this.setState({ mode: "all" })
    } else if (mode == "active") {
      this.setState({ mode: "active" })
    } else if (mode == "completed") {
      this.setState({ mode: "completed" })
    }
  }

  render() {
    return (
      <div className="container">
        <TodoHeader todos={this.state.todos} purge={this.purge} />
        <TodoForm
          item={this.state.item}
          updateItem={this.updateItem}
          addTodo={this.addTodo}
        />
        <TodoList
          todos={this.state.todos}
          checkTodo={this.checkTodo}
          deleteTodo={this.deleteTodo}
          mode={this.state.mode}
        />
        <TodoFooter purge={this.purge} modeChange={this.modeChange} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"))
