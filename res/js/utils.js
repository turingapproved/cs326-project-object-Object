export const makeElement = (element, attributes={}, children=[]) => {
    const node = document.createElement(element);
    for (let attr in attributes) {
        node.setAttribute(attr, attributes[attr]);
    }
    return children.reduce((acc, node) => {
        acc.appendChild(node);
        return acc;
    }, node);
};

export const text = text => {
    return document.createTextNode(text);
};

export const div = (attributes, children) => {
    return makeElement("div", attributes, children);
};

export const p = (attributes, children) => {
    return makeElement("p", attributes, children);
};

export const button = (attributes, children) => {
    return makeElement("button", attributes, children);
};

export const input = (attributes, children) => {
    return makeElement("input", attributes, children);
};

export const label = (attributes, children) => {
    return makeElement('label', attributes, children);
};

export const form = (attributes, children) => {
    return makeElement('form', attributes, children);
};

export const applyStyles = (node, styles) => {
    for (let attr in styles) {
        node.style[attr] = styles[attr];
    }
};

export const applyWidth = (node, width) => {
    applyStyles(node, {'width': width});
};

export const applyMarginTop = (node, margin) => {
    applyStyles(node, {'marginTop': margin});
};