export function post(req, res) {
    req.session.token = req.body.token;
    
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    res.end();
}