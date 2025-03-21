const http = require('http');

const hostname = '127.0.0.1';
const port = 8080;

let users = [];

const server = http.createServer((req, res) => {
    req.setEncoding('utf-8');

    let body = '';  // 儲存請求的 body

    req.on('data', function(chunk) {
        body += chunk;
    });

    req.on('end', function() {
        let user = body.trim();  // 確保字串沒有多餘的空白
        console.log(`${req.method}: ${user}`);

        // 判斷不同的請求方法
        switch (req.method) {
            case 'POST':
                users.push(user);
                console.log(users);
                break;
            case 'PUT':
                try {
                    let data = JSON.parse(user);  // 解析 JSON 來取得舊名稱與新名稱
                    for (let i = 0; i < users.length; i++) {
                        if (users[i] === data.oldName) {
                            users[i] = data.newName;  // 更新舊名稱為新名稱
                            break;
                        }
                    }
                    console.log(users);
                } catch (error) {
                    console.error("無法解析 JSON:", error);
                }
                break;
            case 'DELETE':
                for (let i = 0; i < users.length; i++) {
                    if (user === users[i]) {
                        users.splice(i, 1);
                        break;
                    }
                }
                console.log(users);
                break;
        }

        // 回應請求
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(users));
    });
});

server.listen(port, hostname, () => {
    console.log(`伺服器執行在 http://${hostname}:${port}/`);
});
