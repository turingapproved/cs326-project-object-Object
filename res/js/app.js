import { div, p, button, text, form, label, input } from "./utils.js";

const App = () => {

    let state = localStorage.getItem("state") || {};

    const setStateKey = (key, value) => {
        state[key] = value;
        localStorage.setItem("state", JSON.stringify(state));
    };

    const getStateKey = (key) => {
        return state[key] || null;
    };

    const render = (target) => {
        if (getStateKey('isAuthenticated') !== null) {
            renderLogInSplash(target);
            return;
        }
    };

    const renderLogInSplash = (target) => {
        target.innerHTML = "";
        const titlebar = p({}, [text('Log in as a')]);
        const shelterButton = button({class: 'login-btn shelter-login'}, [text('Shelter')]);
        const donorButton = button({class: 'login-btn donor-login'}, [text('Donor')]);
        const buttonDiv = div({}, [shelterButton, text('Or'), donorButton]);
        const container = div({class: 'login-container', id: 'login-splash'}, [titlebar, buttonDiv]);
        target.appendChild(container);

        shelterButton.addEventListener('click', e => {
            setStateKey('userType', 'shelter');
            renderLogInForm(target);
        });
        donorButton.addEventListener('click', e => {
            setStateKey('userType', 'donor');
            renderLogInForm(target);
        });
    };

    const renderLogInForm = (target) => {
        let logInType = getStateKey('userType');
        target.innerHTML = "";
        const usernameLabel = label({for: 'username'}, [text('Username: ')]);
        const usernameInput = input({type: 'text', id: 'username'});
        const usernameCont = div({}, [usernameLabel, usernameInput]);

        const passwordLabel = label({for: 'password'}, [text('Password: ')]);
        const passwordInput = input({type: 'password', id: 'password'});
        const passwordCont = div({}, [passwordLabel, passwordInput]);

        let buttonClass = logInType === 'shelter' ? 'shelter-login': 'donor-login';
        const submit = button({type: 'submit', class: button + " login-btn"}, [text('Login')]);

        submit.addEventListener('click', e => {
            e.preventDefault();


        });

        const loginForm = form({class: 'login-container', id: 'login-form'}, [usernameCont, passwordCont, submit]);

        target.appendChild(loginForm);
    };

    const authenticate = (username, password) => {
        return fetch();
    };

    return {
        render: render
    };
}

export {
    App
};