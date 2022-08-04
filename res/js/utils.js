const makeElement = (element, attributes, children) => {
    const node = document.createElement(element);
    for (let attr in attributes) {
        node.setAttribute(attr, attributes[attr]);
    }
    return children.reduce((acc, node) => {
        acc.appendChild(node);
        return acc;
    }, node);
}

const text = text => {
    return document.createTextNode(text);
}

const div = (attributes, children) => {
    return makeElement("div", attributes, children);
}

const p = (attributes, children) => {
    return makeElement("p", attributes, children);
}

const button = (attributes, children) => {
    return makeElement("button", attributes, children);
}

const input = (attributes, children) => {
    return makeElement("input", attributes, children);
}