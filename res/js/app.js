import { div, p, button, text, form, label, input, applyMarginTop, applyWidth } from "./utils.js";
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
        const shelterButton = button({class: 'btn shelter-btn'}, [text('Shelter')]);
        const donorButton = button({class: 'btn donor-btn'}, [text('Donor')]);
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

        let buttonClass = logInType === 'shelter' ? 'shelter-btn': 'donor-btn';
        const submit = button({type: 'submit', class: "btn " + buttonClass}, [text('Login')]);

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
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    const renderHomePage = (target) => {
        applyMarginTop(target, "2%");
        applyWidth(target, "80%");

        const userType = state.get('userType')

        target.innerHTML = "";

        const welcomeBar = div({id: 'welcome-bar'}, [p({}, [text('Welcome, [user]!')])]);

        let inputBar = input({id: 'input-bar', type: 'text', placeholder: 'Enter drive name...'});
        let inputButton = button(
            {
                id: 'home-submit-button', 
                class: 'btn ' + (userType === 'shelter' ? 'shelter-btn' : 'donor-btn')
            }, 
            [
                text(userType === 'shelter' ? 'Create' : 'Search')
            ]
            );
        let inputForm = form({}, [inputBar, inputButton]);

        let recentDriveTitle = div({}, [text(userType === 'shelter' ? 'Recently created' : 'Recent searches')]);
        let recentDriveChildren = [];
        for (let i = 0; i < 4; ++i) {
            const driveDisplay = div({class: 'drive-tile'}, [
                div({class: 'drive-title'}, [text('Loading...')]),
                div({class: 'drive-tile-loc'}, [text('Loading...')]),
                div({class: 'drive-tile-completion'}, [div({class: 'drive-tile-completion-bar'})])
            ])
            recentDriveChildren.push(div({class: 'drive-tile-back'}, [driveDisplay]));
        }
        let recentDriveCont = div({class: 'recent-drive-cont'}, [
            recentDriveTitle, 
            div({class: 'recent-drives'}, recentDriveChildren)
        ]);

        const homePageCont = div({class: userType + '-home home-page'}, [welcomeBar, div({}, [inputForm]), recentDriveCont]);

        target.appendChild(homePageCont);
    };

    return {
        render: render
    };
}

export {
    App
};