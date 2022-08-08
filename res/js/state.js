export const State = () => {
    const setValue = (key, value) => {
        state[key] = value;
        localStorage.setItem("state", JSON.stringify(state));
    };

    const getValue = (key) => {
        return state[key] || null;
    };

    const load = () => {
        return JSON.parse(localStorage.getItem("state")) || {};
    }

    const clear = () => {
        state = null;
        localStorage.removeItem("state");
    }

    let state = load();

    return {
        set: setValue,
        get: getValue,
        clear: clear
    }
}