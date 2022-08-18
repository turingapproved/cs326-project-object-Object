const login = async (username, password, type) => {
    const res = await fetch('/auth/login', {
        method: 'POST',
        body: { username, password, type },
        header: {
            'Content-Type': 'application/json'
        }
    });
    return await res.json();
};

const register = async (username, password, type) => {
    const res = await fetch('/auth/register', {
        method: 'POST',
        body: { username, password, type },
        header: {
            'Content-Type': 'application/json'
        }
    });
    return await res.json();
};