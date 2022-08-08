import { div, p, button, text, form, label, input } from "./utils.js";
import { State } from "./state.js";

const App = () => {

    // Used to track app state, using the following keys
    // userType: `shelter` or `donor`
    // sessionId: 
    // username:
    const state = State();

    const render = (target) => {
        if (state.get('isAuthenticated') === null) {
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
            state.set('userType', 'shelter');
            renderLogInForm(target);
        });
        donorButton.addEventListener('click', e => {
            state.set('userType', 'donor');
            renderLogInForm(target);
        });
    };

    const renderLogInForm = (target, splashText) => {
        let logInType = state.get('userType');
        target.innerHTML = "";
        const usernameLabel = label({for: 'username'}, [text('Username: ')]);
        const usernameInput = input({type: 'text', id: 'username'});
        const usernameCont = div({}, [usernameLabel, usernameInput]);

        const passwordLabel = label({for: 'password'}, [text('Password: ')]);
        const passwordInput = input({type: 'password', id: 'password'});
        const passwordCont = div({}, [passwordLabel, passwordInput]);

        let buttonClass = logInType === 'shelter' ? 'shelter-login': 'donor-login';
        const submit = button({type: 'submit', class: buttonClass + " login-btn"}, [text('Login')]);

        submit.addEventListener('click', e => {
            e.preventDefault();

            let username = document.getElementById('username');
            let password = document.getElementById('password');

            authenticate(username.value, password.value).then((response) => {
                renderHomePage(target);
            });

            username.value = "";
            password.value = "";
        });

        const loginForm = form({class: 'login-container', id: 'login-form'}, [usernameCont, passwordCont, submit]);

        target.appendChild(loginForm);
    };

    const authenticate = (username, password) => {
        return fetch((resolve, reject) => {
            resolve();
        });
    };

    return {
        render: render
    };
}

export {
    App
};