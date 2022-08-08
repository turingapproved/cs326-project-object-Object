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
                div({class: 'title'}, [text('Loading...')]),
                div({class: 'loc'}, [text('Loading...')]),
                div({class: 'completion'}, [div({class: 'completion-bar' + (i === 3 ? ' finished' : '')})])
            ]);
            driveDisplay.addEventListener('click', e => {
                renderDrivePage(target, 0);
            });
            recentDriveChildren.push(div({class: 'drive-tile-back'}, [driveDisplay]));
        }
        let recentDriveCont = div({class: 'recent-drive-cont'}, [
            recentDriveTitle, 
            div({class: 'recent-drives'}, recentDriveChildren)
        ]);

        const homePageCont = div({class: userType + '-home home-page'}, [welcomeBar, div({}, [inputForm]), recentDriveCont]);

        target.appendChild(homePageCont);
    };

    const renderDrivePage = (target, driveId) => {
        target.innerHTML = "";
        applyWidth(target, "50%");

        const driveTitle = p({class: 'title'}, [text('[drive title]')]);
        const driveInfo = div({class: 'info'}, [
            div({class: 'loc'}, [text('Location: [drive location]')]),
            div({class: 'manager'}, [text('Manager [drive manager]')]),
            div({class: 'contact'}, [text('Contact info: [contact information]')])
        ]);
        const requirements = [];
        for (let i = 0; i < 6; i++) {
            const requirement = div({class: 'requirement'}, [
                p({class: 'title'}, [text('[requirement]')]),
                div({class: 'completion-cont'}, [
                    div({class: 'completion'}, [div({class: 'completion-bar' + (i === 3 ? ' finished' : '')})])
                ])
            ]);
            requirements.push(requirement);
        }
        const requirementsCont = div({class: 'requirements'}, requirements);
        target.appendChild(
            div({class: 'drive-page'}, [driveTitle, driveInfo, requirementsCont])
        );
    };

    const fetchDrive = (driveId) => {
        return new Promise((resolve, reject) => {
            resolve();
        })
    };

    return {
        render: render
    };
}

export {
    App
};