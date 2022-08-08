export const State = () => {
    let state = localStorage.getItem("state") || {};

    const setValue = (key, value) => {
        state[key] = value;
        localStorage.setItem("state", JSON.stringify(state));
    };

    const getValue = (key) => {
        return state[key] || null;
    };

    return {
        set: setValue,
        get: getValue
    }
}