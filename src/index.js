
const collections = [
    {
        'name': 'Books',
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

}

const customElement = elementName => 
    new CustomElement()
        .element(elementName)

const displayItem = (itemName, index) =>
    customElement('li').withChilds([
        customElement('span').withInnerText(itemName),
        customElement('input').withCustomAttribute('type', 'checkbox')
    ])

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

    }))

    root.build()

}

generateHTML()

