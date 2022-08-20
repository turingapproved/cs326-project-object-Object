import { div, p, button, text, form, label, input, applyMarginTop, applyWidth, makeElement, span } from "./utils.js";
import { State } from "./state.js";
import { renderRecentlyCreated, renderRecentlyViewed, createDrive, renderSearchResults, fetchDrive, fetchDriveRequirements, deleteDrive } from "./drive.js";
import { login, register } from "./auth.js";
import { renderRequirement } from "./requirement.js";


// Handles rendering by stepping through various pages
const App = () => {

    // Used to track app state, using the following keys
    // user: {name, id, type}
    const state = State();

    const render = (target) => {
        // If we have a user then render their home page, otherwise the login screen
        if (state.get('user') === null) {
            renderLogInSplash(target);
        } else {
            renderHomePage(target);
        }
    };

    // Prompt the user to pick their type
    const renderLogInSplash = (target) => {
        target.innerHTML = "";
        const titlebar = p({}, [text('Log in as a')]);
        const shelterButton = button({class: 'btn shelter-btn'}, [text('Shelter')]);
        const donorButton = button({class: 'btn donor-btn'}, [text('Donor')]);
        const buttonDiv = div({}, [shelterButton, text('Or'), donorButton]);
        const container = div({class: 'login-container', id: 'login-splash'}, [titlebar, buttonDiv]);
        target.appendChild(container);

        shelterButton.addEventListener('click', e => {
            renderLogInForm(target, 'shelter');
        });
        donorButton.addEventListener('click', e => {
            renderLogInForm(target, 'donor');
        });
    };

    const renderLogInForm = (target, type, splashText) => {
        target.innerHTML = "";
        const usernameLabel = label({for: 'username'}, [text('Username: ')]);
        const usernameInput = input({type: 'text', id: 'username'});
        const usernameCont = div({}, [usernameLabel, usernameInput]);

        const passwordLabel = label({for: 'password'}, [text('Password: ')]);
        const passwordInput = input({type: 'password', id: 'password'});
        const passwordCont = div({}, [passwordLabel, passwordInput]);

        let buttonClass = type === 'shelter' ? 'shelter-btn': 'donor-btn';
        const loginButton = button({type: 'submit', class: "btn " + buttonClass}, [text('Login')]);
        const registerButton = button({type: 'submit', class: "btn " + buttonClass}, [text('Register')]);

        loginButton.addEventListener('click', async e => {
            e.preventDefault();

            let username = document.getElementById('username');
            let password = document.getElementById('password');

            const res = await login(username.value, password.value, type);

            if (!res.id) {
                // There was an error
                renderLogInForm(target, type, res.message)
            } else {
                // Success
                state.set('user', res);
                renderHomePage(target);
            }

            username.value = "";
            password.value = "";
        });

        registerButton.addEventListener('click', async e => {
            e.preventDefault();

            let username = document.getElementById('username');
            let password = document.getElementById('password');

            const res = await register(username.value, password.value, type);

            if (res.status !== 'success') {
                // There was an error
                renderLogInForm(target, type, res.message);
            } else {
                // they have registered, but now need to login
                // log in is done on the same page, so just flash a message
                renderLogInForm(target, type, 'Registered successfully! Now log in.');
            }

            username.value = "";
            password.value = "";
        });

        const children = [usernameCont, passwordCont, loginButton, registerButton];
        if (splashText) children.push(p({class: 'error splash'}, [text(splashText)]));

        const loginForm = form({class: 'login-container', id: 'login-form'}, children);

        target.appendChild(loginForm);
    };

    const renderHomePage = (target) => {
        applyMarginTop(target, "2%");
        applyWidth(target, "80%");

        const user = state.get('user');
        const userType = user.type;

        target.innerHTML = "";

        const welcomeBar = div({id: 'welcome-bar'}, [p({}, [text(`Welcome, ${user.name}!`)])]);

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

        // Don't know how many so just leave it empty
        const recentDrives = div({class: 'drive-display compact'}, []);

        // Don't need the data from these, so don't wait for them
        if (userType === 'shelter') {
            renderRecentlyCreated(user.id, recentDrives, (id) => renderDrivePage(target, id));
        } else {
            renderRecentlyViewed(user.id, recentDrives, (id) => renderDrivePage(target, id));
        }

        const recentDriveTitle = div({}, [text(userType === 'shelter' ? 'Recently created' : 'Recently viewed')]);
        const recentDriveCont = div({id: 'recent-drive-cont'}, [
            recentDriveTitle, 
            recentDrives
        ]);

        const homePageCont = div({class: userType + '-home home-page'}, [welcomeBar, div({}, [inputForm]), recentDriveCont]);

        target.appendChild(homePageCont);
    };

    const renderDrivePage = async (target, driveId) => {
        target.innerHTML = "";
        applyWidth(target, "70%");
        const user = state.get('user');''

        const location = span({ class: 'shelter-info' }, [text('[location]')]);
        const manager = span({ class: 'shelter-info' }, [text('[manager]')]);
        const contact = span({ class: 'shelter-info' }, [text('[contact]')]);

        const driveTitle = p({class: 'title'}, [text('[drive title]')]);
        const driveInfo = div({class: 'info'}, [
            div({class: 'loc'}, [text('Location: '), location]),
            div({class: 'manager'}, [text('Manager '), manager]),
            div({class: 'contact'}, [text('Contact info: '), contact])
        ]);
        const requirementsCont = div({class: 'requirements'}, []);
        const deleteButton = button({id: 'delete', class: 'btn danger-btn small'}, [text('Delete')]);
        deleteButton.addEventListener('click', async e => {
            // Wait until we delete it to show the page again
            await deleteDrive(driveId);
            renderHomePage(target);
        });
        const outerCont = div({class: 'drive-page'}, [driveTitle, driveInfo, requirementsCont]);
        target.appendChild(
            outerCont
        );

        // wait only after we've rendered placeholders
        const drive = await fetchDrive(driveId);
        driveTitle.innerHTML = drive.name;
        contact.innerHTML = drive.contact_info;
        location.innerHTML = drive.location;
        manager.innerHTML = drive.manager;

        // Only show the delete button if the drive belongs to the user
        if (drive.creator_id === user.id) {
            outerCont.appendChild(deleteButton);
        }

        const requirements = await fetchDriveRequirements(driveId);
        requirements.forEach(requirement => renderRequirement(requirement, requirementsCont));
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

        let driveDisplay = div({class: 'drive-display compact'});

        let resultsCont = div({id: 'result-drives-cont'}, [driveDisplay]);

        // We don't the result so don't wait for it
        renderSearchResults(inputBar.value, driveDisplay, (id) => renderDrivePage(target, id))

        target.appendChild(div({id: 'search-results'}, [welcomeBar, inputForm, resultsCont]));
    };

    const renderCreateDrivePage = async (target, title) => {
        target.innerHTML = "";

        applyWidth(target, "50%");
        applyMarginTop(target, "5%");

        const locInput = input({type: 'text', id: 'create-loc'});
        const managerInput = input({type: 'text', id: 'create-manager'});
        const contactInput = input({type: 'text', id: 'create-contact'});

        const requirementsElem = div({class: 'requirements'}, [
            p({}, [text('Type')]),
            p({}, [text('Quantity')]),
            input({type: 'text'}),
            input({type: 'number'})
        ]);

        const addRowBtn = button({type: 'button', class: 'btn shelter-btn small'}, [text('Add row')]);
        addRowBtn.addEventListener('click', e => {
            requirementsElem.appendChild(input({type: 'text'}));
            requirementsElem.appendChild(input({type: 'number'}));
        });

        const submitButton = button({class: 'btn shelter-btn'}, [text('Submit')]);
        submitButton.addEventListener('click', async e => {
            e.preventDefault();
            const requirements = [];
            // The requirements don't have any strucutral divs, so we need
            // to loop over every set of two (they only come in pairs)
            for (let i = 1; i < requirementsElem.children.length / 2; i++) {
                requirements.push({
                    good: requirementsElem.children[2 * i].value,
                    quantity: requirementsElem.children[2 * i + 1].value
                })
            }
            // Wait until the drive is created to show the home page again
            await createDrive(title, locInput.value, managerInput.value, contactInput.value, requirements);
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
                        requirementsElem,
                        addRowBtn
                    ]),
                    submitButton
                ])
            ])
        );
    };

    // Clears all state and redisplays the login splash
    const logout = (target) => {
        state.clear();
        renderLogInSplash(target);
    }

    // expose API to toolbar buttons
    return {
        render: render,
        home: renderHomePage,
        logout: logout
    };
}

export {
    App
};