import { getActionName } from "./ActionGenerator"

const defaultValues = {
    "boolean": "true",
    "number": 0,
    "string": '""'
}

const getDefaultValue = (type: string):string => {
    return Object.keys(defaultValues).includes(type) ? defaultValues[type] : "undefined"
}

export const generateReducer = (model: string[], interfaceName: string):string => {
    model = model.map(i => i.replace("?", ""))
    const result:string[] = []

    result.push(`import { ${model.map(i => getActionName(i.split(":")[0])).join(", ")} , ${getActionName("full" + interfaceName.slice(1))} } from "../actions/${interfaceName.slice(1)}Actions.ts"`)

    result.push(`export interface ${interfaceName}State extends ${interfaceName} {`)
    result.push("}")
    result.push("")
    result.push(`export interface ${interfaceName}ActionState {`)
    model.forEach(i => result.push(`\t${i.replace(":", "?:")}`))
    result.push("}")
    result.push("")
    result.push(`export interface ${interfaceName}Action {`)
    result.push("\ttype: string")
    result.push(`\tpayload: ${interfaceName}ActionState`)
    result.push("}")
    result.push("")
    result.push(`export const ${interfaceName[1].toLowerCase() + interfaceName.slice(2)}InitialState: ${interfaceName}State = {`)
    model.forEach(i => result.push(`\t${i.split(":")[0]}: ${getDefaultValue(i.split(":")[1].trim())},`))

    result.push("}")
    result.push("")
    result.push(`export const ${interfaceName[1].toLowerCase() + interfaceName.slice(2)}Reducer = (state: ${interfaceName}State = ${interfaceName[1].toLowerCase() + interfaceName.slice(2)}InitialState, action: ${interfaceName}Action): ${interfaceName}State => {`)
    result.push("\tswitch(action.type) {")
    model.forEach(i => {
        const attr = i.split(":")[0]
        result.push(`\t\tcase ${getActionName(attr)}: `)
        result.push("\t\t\treturn {")
        result.push("\t\t\t\t...state,")
        result.push(`\t\t\t\t${attr}: action.payload.${attr} !== undefined?action.payload.${attr}:state.${attr}`)
        result.push("\t\t\t}")

    })
    
    result.push(`\t\tcase ${getActionName('full' + interfaceName.slice(1))}:`)
    result.push("\t\t\treturn {")
    result.push("\t\t\t\t...state, ")
    model.forEach(i => {
        const attr = i.split(":")[0]
        result.push(`\t\t\t\t${attr}: action.payload.${attr} !== undefined?action.payload.${attr}:state.${attr},`)
 
    })

    result.push("\t\t\t}")

    result.push("\t\tdefault: return state")
    result.push("\t}")
    result.push("}")
    return result.join("\n")

}