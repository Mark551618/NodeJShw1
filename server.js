// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// 中介軟體設定
app.use(express.json()); // 解析 JSON 請求
app.use(cors());         // 處理跨域問題（若前後端分離時需要）
app.use(express.static(path.join(__dirname, 'public'))); // ⭐ 提供靜態檔案
app.get('/', (req, res) => { //直接針對根路徑設定一個 GET 路由來回傳 index.html
    res.sendFile(path.join(__dirname, 'index.html'));
  });

// 連線到 MongoDB
mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB 連線成功'))
.catch(err => console.error('MongoDB 連線失敗', err));

// 定義書籍的 Mongoose Schema 與 Model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  pages: Number,
});

const Book = mongoose.model('Book', bookSchema);

// API 路由

// 1. 新增一本書 (POST /books)
app.post('/books', async (req, res) => {
  try {
    const { title, author, pages } = req.body;
    const newBook = new Book({ title, author, pages });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. 取得所有書籍 (GET /books)
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. 更新書籍 (PUT /books/:id)
app.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, pages } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, pages },
      { new: true } // 回傳更新後的資料
    );
    if (!updatedBook) {
      return res.status(404).json({ error: '找不到該書籍' });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. 刪除書籍 (DELETE /books/:id)
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ error: '找不到該書籍' });
    }
    res.status(200).json({ message: '刪除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 啟動伺服器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
