export const createRequirement = (driveId, good, quantity) => {
    const res = await fetch (`/requirement`, {
        method: 'POST',
        body: JSON.stringify({ good, quantity, driveId }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await res.json();
};

const renderRequirementCompletionBar = async (id, target) => {
    const res = await fetch(`/requirement/${id}/completionRate`);
    const data = await res.json();

    target.appendChild(div({class: 'completion-bar', 'style': `width: ${data.percent}%`}));
}

const fetchRequirement = async (reqId) => {
    const res = await fetch(`/requirement/${reqId}`);
    return await res.json();
};