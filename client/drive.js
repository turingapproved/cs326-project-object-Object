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

const renderDrive = async (drive, driveTarget, drivePageTarget) => {
    const completionOuter = div({class: 'completion'}, []);
    renderCompletionBar(id, completionOuter);
    const driveDisplay = div({class: 'drive-tile'}, [
        div({class: 'title'}, [text(drive.name)]),
        div({class: 'loc'}, [text(drive.location)]),
        completionOuter
    ]);
    driveDisplay.addEventListener('click', e => {
        renderDrivePage(drivePageTarget, 0);
    });
    driveTarget.appendChild(driveDisplay);
};

const renderCompletionBar = async (id, target) => {
    const res = await fetch(`/drive/${id}/completionRate`);
    const data = await res.json();

    target.appendChild(div({class: 'completion-bar', 'style': `width: ${data.percent}%`}));
}

const fetchDrive = async (driveId) => {
    const res = await fetch(`/drive/${id}`);
    return await res.json();
};

const createDrive = async (name, location, manager, contact_info, description) => {
    const res = await fetch('/drive', {
        mehtod: 'POST',
        body: JSON.stringify({ name, location, manager, description, contact_info }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    return data;
};
