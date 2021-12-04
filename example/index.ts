import {sum} from "web-components-system"

const result = sum(6, 0)

const child = document.createElement("div")
child.innerText = `${result}`

document.body.appendChild(child)