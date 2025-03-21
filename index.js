const express = require('express');
const app = express();
const port = 3000;

// 使用 express.json() 解析 JSON 格式的請求主體
app.use(express.json());

// 模擬資料庫，用一個陣列存放待辦事項
let todos = [
  { id: 1, title: '學習 Node.js', completed: false },
  { id: 2, title: '學習 Express', completed: false }
];

// 取得所有待辦事項
app.get('/todos', (req, res) => {
  res.json(todos);
});

// 取得單一待辦事項（根據 id）
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: '找不到該待辦事項' });
  }
  res.json(todo);
});

// 新增待辦事項
app.post('/todos', (req, res) => {
  // 簡單範例：不做資料驗證，直接使用 req.body.title
  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    title: req.body.title,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// 更新待辦事項（根據 id）
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: '找不到該待辦事項' });
  }
  // 更新標題與狀態（若有傳入的話）
  todo.title = req.body.title || todo.title;
  if (req.body.completed !== undefined) {
    todo.completed = req.body.completed;
  }
  res.json(todo);
});

// 刪除待辦事項（根據 id）
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter(t => t.id !== id);
  if (todos.length === initialLength) {
    return res.status(404).json({ error: '找不到該待辦事項' });
  }
  res.json({ message: '已刪除待辦事項' });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
