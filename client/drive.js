import { createRequirement } from "./requirement.js";
import { div, text } from "./utils.js";

export const renderRecentlyCreated = async (shelterId, driveTarget, drivePageTarget) => {
    const res = await fetch(`/shelter/${shelterId}/recentlyCreated`);
    const data = await res.json();

    data.forEach(drive => {
        renderDrive(drive, driveTarget, drivePageTarget);
    });
};

export const renderRecentlyViewed = async (donorId, driveTarget, drivePageTarget) => {
    const res = await fetch(`/donor/${donorId}/recentlyViewed`);
    const data = await res.json();

    data.forEach(drive => {
        renderDrive(drive, driveTarget, drivePageTarget);
    });
};

export const renderSearchResults = async(search, target, callback) => {
    const drives = await fetchSearchResults(search);

    drives.forEach(drive => renderDrive(drive, target, callback));
};

const fetchSearchResults = async (search) => {
    const res = await fetch('/search?q=' + encodeURI(search));
    return await res.json();
};

const renderDrive = async (drive, driveTarget, callback) => {
    const completionOuter = div({class: 'completion'}, []);
    renderDriveCompletionBar(drive.id, completionOuter);
    const driveDisplay = div({class: 'drive-tile'}, [
        div({class: 'title'}, [text(drive.name)]),
        div({class: 'loc'}, [text(drive.location)]),
        completionOuter
    ]);
    driveDisplay.addEventListener('click', e => {
        if (callback) callback(drive.id);
    });
    driveTarget.appendChild(div({class: 'drive-tile-back'}, [driveDisplay]));
};

const renderDriveCompletionBar = async (id, target) => {
    const res = await fetch(`/drive/${id}/completionRate`);
    const data = await res.json();
    target.innerHTML = "";
    const percent = Math.min(100, parseFloat(data.percent));
    let classString = 'completion-bar';
    if (percent === 100) {
        classString += ' finished';
    }
    target.appendChild(div({class: classString, 'style': `width: ${data.percent}%`}));
}

export const fetchDrive = async (driveId) => {
    const res = await fetch(`/drive/${driveId}`);
    return await res.json();
};

export const createDrive = async (name, location, manager, contact_info, requirements) => {
    const res = await fetch('/drive', {
        method: 'POST',
        body: JSON.stringify({ name, location, manager, contact_info }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();

    requirements.forEach(req => {
        // Don't wait for them, try to return to main screen asap
        createRequirement(data.id, req.good, req.quantity);
    })

    return data;
};

export const fetchDriveRequirements = async (driveId) => {
    const res = await fetch(`drive/${driveId}/requirements`);
    return await res.json();
};
