export const getActionName = (attr: string) => {
    let words: string[] = []
    let word:string[] = []

    for(const i of attr){
        if(i.charCodeAt(0) < 97){
            words.push(word.join(""))
            word = []
            word.push(i)
        }
        else{
            word.push(i)
        }
    }
    words.push(word.join(""))

    words = words.map(i => i.toUpperCase())
    
    return `SET_${words.join("_")}`
}

export const generateAction = (name: string, type: string, interfaceName: string) => {
    const result: string[] = []
    result.push(`export const set${name[0].toUpperCase() + name.slice(1)} = (dispatch: React.Dispatch<${interfaceName}Action>, ${name}: ${type}) => {`)
    result.push(`\tdispatch({type: ${getActionName(name)}, payload: {${name}: ${name}}})`)
    result.push("}")
    return result.join("\n")
}

export const generateActions = (model: string[], interfaceName: string):string => {
    model = model.map(i => i.replace("?", ""))
    const result:string[] = []
    result.push(`import { ${interfaceName} } from "../reducers/${interfaceName.slice(1)}Reducer"`)
    result.push("")
    model.forEach(attr => {
        const name = getActionName(attr.split(":")[0])
        result.push(`export const ${name}:string = "${name}"`)
    })
    result.push(`export const ${getActionName('full'+interfaceName.slice(1))}:string = "${getActionName("full" + interfaceName.slice(1))}"`)
    result.push("")

    model.forEach(attr=>{
        result.push(generateAction(attr.split(":")[0], attr.split(":")[1], interfaceName))
    })
    result.push(`export const setFull${interfaceName.slice(1)} = (dispatch: React.Dispatch<${interfaceName}Action>, ${interfaceName[1].toLowerCase()}${interfaceName.slice(2)}: ${interfaceName}) => {`)
    result.push(`\tdispatch({type: ${getActionName("full" + interfaceName.slice(1))}}, payload: { ...${interfaceName[1].toLowerCase()}${interfaceName.slice(2)}})`)
    result.push("}")
    return result.join("\n")
}