listItem.className = "todo-item";
listItem.textContent = todoText;
listItem.appendChild(deleteBtn);
removeChild(node)
listItem.getAttribute('arial-name')
listItem.parentElement
listItem.remove()

target.className

firstChild
lastChild
children

### Important diff b/w Nodes and Elements
1. Nodes are element nodes, text nodes, Whitespace between elements, and comment nodes.
2. Elements are only element nodes.

document.createTextNode("Water"); // Node, not element
const listItem = document.createElement("li"); // creates element

createTextNode vs createElement
childNodes vs children
firstChild vs firstElementChild
lastChild vs lastElementChild
nextSibling vs nextElementSibling
parentNode vs parentElement
getAttributeNode(attributeName).value vs getAttribute(attributeName) 
removeAttribute(attributeName)
