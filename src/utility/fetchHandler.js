export async function fetchHandler(url) {
    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    const res = await req.json();
    return res;
}