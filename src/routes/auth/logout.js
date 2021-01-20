export function post(req, res) {
    req.session.token = null;
    
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    res.end();
}