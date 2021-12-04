import {sum} from "web-components-system"

const result = sum(1, 3)

const child = document.createElement("div")
child.innerText = `${result}`

document.body.appendChild(child)