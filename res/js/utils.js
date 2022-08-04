const makeElement = (element, attributes, styles, children) => {
    const node = document.createElement(element);
    for (let attr in attributes) {
        node.setAttribute(attr, attributes[attr]);
    }
    applyStyles(node, styles)
    return children.reduce((acc, node) => {
        acc.appendChild(node);
        return acc;
    }, node);
};

const text = text => {
    return document.createTextNode(text);
};

const div = (attributes, styles, children) => {
    return makeElement("div", attributes, styles, children);
};

const p = (attributes, styles, children) => {
    return makeElement("p", attributes, styles, children);
};

const button = (attributes, styles, children) => {
    return makeElement("button", attributes, styles, children);
};

const input = (attributes, styles, children) => {
    return makeElement("input", attributes, styles, children);
};

const applyStyles = (node, styles) => {
    for (let attr in styles) {
        node.style[attr] = styles[attr];
    }
};

const applyWidth = (node, width) => {
    applyStyles(node, {'width': width});
};

const applyMarginTop = (node, margin) => {
    applyStyles(node, {'marginTop': margin});
};

export {
    makeElement,
    text,
    div,
    p,
    button,
    input,
    applyStyles,
    applyWidth,
    applyMarginTop
};