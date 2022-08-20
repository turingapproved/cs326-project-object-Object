import { div, text, p, button, input } from "./utils.js";

export const createRequirement = async (driveId, good, quantity) => {
    const res = await fetch (`/requirement`, {
        method: 'POST',
        body: JSON.stringify({ good, quantity, driveId }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await res.json();
};

export const renderRequirement = (requirement, target) => {
    const completionOuter = div({class: 'completion'});
    const donateButton = button({id: 'donate', class: 'btn donor-btn small'}, [text('Donate')]);
    const donateInput = input({type: "number", placeholder:"0"});
    const requirementElem = div({class: 'requirement'}, [
        p({class: 'title'}, [text(requirement.good)]),
        div({class: 'completion-cont'}, [
            completionOuter
        ]),
        div({class: 'donate-input'}, [
            donateInput,
            donateButton
        ])
    ]);
    donateButton.addEventListener('click', async e => {
        await fetch(`/requirement/${requirement.id}/donate`, {
            method: 'POST',
            body: JSON.stringify({
                quantity: donateInput.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // We have posted the donation, clear the input
        donateInput.value = "";
        renderRequirementCompletionBar(requirement.id, completionOuter);
    })
    target.appendChild(requirementElem);
    renderRequirementCompletionBar(requirement.id, completionOuter);
};

const renderRequirementCompletionBar = async (id, target) => {
    const res = await fetch(`/requirement/${id}/completionRate`);
    const data = await res.json();
    target.innerHTML = "";
    const percent = Math.min(100, parseFloat(data.percent));
    let classString = 'completion-bar';
    if (percent === 100) {
        classString += ' finished';
    }
    target.appendChild(div({class: classString, 'style': `width: ${data.percent}%`}));
};