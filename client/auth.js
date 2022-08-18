export const login = async (username, password, type) => {
    const res = await fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, type }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await res.json();
};

export const register = async (username, password, type) => {
    const res = await fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, type }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await res.json();
};