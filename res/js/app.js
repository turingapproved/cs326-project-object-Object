import { div, p, button, text, form, label, input, applyMarginTop, applyWidth, makeElement, span } from "./utils.js";
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

    const renderHomePage = (target) => {
        applyMarginTop(target, "2%");
        applyWidth(target, "80%");

        const userType = state.get('userType')

        target.innerHTML = "";

        const welcomeBar = div({id: 'welcome-bar'}, [p({}, [text('Welcome, [user]!')])]);

        let inputBar = input({ type: 'text', placeholder: 'Enter drive name...'});
        let inputButton = button(
            {
                class: 'btn small ' + (userType === 'shelter' ? 'shelter-btn' : 'donor-btn'),
                type: 'submit',
                disabled: true
            }, 
            [
                text(userType === 'shelter' ? 'Create' : 'Search')
            ]
        );
        let listenerFunc = userType === 'shelter' ? renderCreateDrivePage : renderSearchResultsPage;
        let inputForm = form({class: 'input-bar'}, [inputBar, inputButton]);
        inputBar.addEventListener('keyup', e => {
            if (inputBar.value !== '') {
                inputButton.disabled = false;
            } else {
                inputButton.disabled = true;
            }
        });
        inputForm.addEventListener('submit', e => { 
            e.preventDefault();
            listenerFunc(target, inputBar.value); 
        });

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
        let recentDriveCont = div({id: 'recent-drive-cont'}, [
            recentDriveTitle, 
            div({class: 'drive-display compact'}, recentDriveChildren)
        ]);

        const homePageCont = div({class: userType + '-home home-page'}, [welcomeBar, div({}, [inputForm]), recentDriveCont]);

        target.appendChild(homePageCont);
    };

    const renderDrivePage = (target, driveId) => {
        target.innerHTML = "";
        applyWidth(target, "50%");

        const driveTitle = p({class: 'title'}, [text('[drive title]')]);
        const driveInfo = div({class: 'info'}, [
            div({class: 'loc'}, [text('Location: '), span({ class: 'shelter-info' }, [text('[location]')])]),
            div({class: 'manager'}, [text('Manager '), span({ class: 'shelter-info' }, [text('[manager]')])]),
            div({class: 'contact'}, [text('Contact info: '), span({ class: 'shelter-info' }, [text('[contact info]')])]),
            div({class: 'rating'}, [text('Rating: '), span({ class: 'donor-info' }, [text('[rating]')])])
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
        const donateButton = button({id: 'donate', class: 'btn donor-btn small'}, [text('Donate')]);
        const comments = [];
        for (let i = 0; i < 6; i++) {
            const comment = div({class: 'comment'}, [
                div({}, [
                    p({class: 'name'}, [text('[commenter name]'), span({ class: 'shelter-info'}, [text(' [rating]')])]),
                ]),
                p({class: 'text'}, [text('[comment]')]),
            ]);
            comments.push(comment);
        }
        const commentsCont = div({class: 'comments'}, comments);
        const submitButton = button({class: 'btn donor-btn', type: 'submit'}, [text('Post')]);
        const commentForm = form({class: 'comment-editor'}, [
            makeElement('textarea', {placeholder: 'Enter comment...'}),
            submitButton
        ]);
        const commentSection = div({class: 'comment-section'}, [
            p({class: 'title'}, [text('Comment section')]),
            commentsCont, 
            commentForm
        ]);
        target.appendChild(
            div({class: 'drive-page'}, [driveTitle, driveInfo, requirementsCont, donateButton, commentSection])
        );
    };

    const renderSearchResultsPage = (target, search) => {
        target.innerHTML = "";
        let userType = state.get('userType');
        
        const welcomeBar = div({id: 'welcome-bar'}, [p({}, [text('Search results')])]);

        let inputBar = input({type: 'text', placeholder: 'Enter drive name...'});
        inputBar.value = search;
        let inputButton = button(
            {
                class: 'btn small ' + (userType === 'shelter' ? 'shelter-btn' : 'donor-btn'),
                type: 'submit'
            }, 
            [
                text('Search')
            ]
        );
        let inputForm = form({class: 'input-bar'}, [inputBar, inputButton]);
        inputBar.addEventListener('keyup', e => {
            if (inputBar.value !== '') {
                inputButton.disabled = false;
            } else {
                inputButton.disabled = true;
            }
        });
        inputForm.addEventListener('submit', e => { 
            e.preventDefault();
            renderSearchResultsPage(target, inputBar.value); 
        });

        let results = [];
        for (let i = 0; i < 8; ++i) {
            const driveDisplay = div({class: 'drive-tile'}, [
                div({class: 'title'}, [text('Loading...')]),
                div({class: 'loc'}, [text('Loading...')]),
                div({class: 'completion'}, [div({class: 'completion-bar' + (i === 3 ? ' finished' : '')})])
            ]);
            driveDisplay.addEventListener('click', e => {
                renderDrivePage(target, 0);
            });
            results.push(div({class: 'drive-tile-back'}, [driveDisplay]));
        }
        let resultsCont = div({id: 'result-drives-cont'}, [
            div({class: 'drive-display compact'}, results)
        ]);

        target.appendChild(div({id: 'search-results'}, [welcomeBar, inputForm, resultsCont]));
    };

    const renderCreateDrivePage = (target, title) => {
        target.innerHTML = "";

        applyWidth(target, "50%");

        const locInput = input({type: 'text', id: 'create-loc'});
        const managerInput = input({type: 'text', id: 'create-manager'});
        const contactInput = input({type: 'text', id: 'create-contact'});

        const requirements = div({class: 'requirements'}, [
            p({}, [text('Type')]),
            p({}, [text('Quantity')]),
            input({type: 'text'}),
            input({type: 'number'})
        ]);

        const addRowBtn = button({type: 'button', class: 'btn shelter-btn small'}, [text('Add row')]);
        addRowBtn.addEventListener('click', e => {
            requirements.appendChild(input({type: 'text'}));
            requirements.appendChild(input({type: 'number'}));
        });

        const submitButton = button({class: 'btn shelter-btn'}, [text('Submit')]);
        submitButton.addEventListener('click', e => {
            renderHomePage(target);
        });

        target.appendChild(
            div({id: 'create-cont'}, [
                p({}, [text(title)]),
                form({id: 'create-drive-form'}, [
                    div({id: 'create-form-left-align'}, [
                        div({}, [
                            label({for: 'create-loc'}, [text('Drive locations: ')]),
                            locInput,
                        ]),
                        div({}, [
                            label({for: 'create-manager'}, [text('Manger: ')]),
                            managerInput,
                        ]),
                        div({}, [
                            label({for: 'create-contact'}, [text('Contact info: ')]),
                            contactInput,
                        ])
                    ]),
                    div({id: 'create-form-requirements-cont'}, [
                        p({}, [text('Requirements')]),
                        requirements,
                        addRowBtn
                    ]),
                    submitButton
                ])
            ])
        );
    };

    const fetchDrive = (driveId) => {
        return new Promise((resolve, reject) => {
            resolve();
        })
    };

    const authenticate = (username, password) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    const fetchSearchResults = (search) => {
        return new Promise((resolve, reject) => {
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