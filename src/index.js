
const collections = [
    {
        'name': 'Books',
        // TODO: mudar para uma estrutura mais complexa
        'items' : [
            'structure and interpretation of computer programs',
            'the javascript book',
            'javascript: the good parts',
        ]
    },
]

// agora parece PF
class CustomElement{
    constructor(node, effects = []){
        this.node = node
        this.effects = effects
    }

    element(elementName){
        this.node = document.createElement(elementName)
        this.effects = []
        return this
    }

    pureEffect(effect){
        this.effects.push(effect)
        return this
    }

    // o unico side-effect realizado
    build(){
        this.effects.forEach(effect => effect(this.node))
        return this
    }

    withInnerText(text){
        return this.pureEffect(node => { node.innerText = text })
    }

    withChild(customChild){
        return this.pureEffect(node => node.append(customChild.build().node))
    }

    withChilds(customChildList){
        return customChildList.reduce((acc, child) => acc.withChild(child), this)
    }

    withCustomAttribute(name, value){
        return this.pureEffect(node => node.setAttribute(name, value))
    }

    withEventListener(e, f){
        return this.pureEffect(node => node.addEventListener(e, f))
    }

}

const customElement = elementName => 
    new CustomElement()
        .element(elementName)

const displayItem = (itemName, index) => {

    const text = customElement('span').withInnerText(itemName)

    const checkbox = customElement('input')
        .withCustomAttribute('type', 'checkbox')
        .withEventListener('change', e => {
            // TODO: WIP
            text.withInnerText('selecionado').build()
        })

    return customElement('li').withChilds([text, checkbox]) 
}

function generateHTML(){
    const root = new CustomElement(document.querySelector('#app')).withChilds(collections.map(collection => {

        const name = new CustomElement()
            .element('p')
            .withInnerText(collection.name)

        const items = collection.items.map(displayItem)

        const collectionContainer = new CustomElement()
            .element('ul')
            .withChilds(items)

        const div = new CustomElement()
            .element('div')
            .withChilds([name, collectionContainer])

        return div

    })).build()

}

generateHTML()

