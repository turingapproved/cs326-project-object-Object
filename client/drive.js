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

const fetchDrive = (driveId) => {
    const res = await fetch(`/drive/${id}`);
    return await res.json();
};
