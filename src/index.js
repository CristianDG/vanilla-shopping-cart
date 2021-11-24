
const collections = [
    {
        'name': 'Books',
        'items' : [
            'sicp',
            'the javascript book',
            'javascript: the good parts',
        ]
    },
]
// parece PF mas de certeza não é
class CustomElement{
    constructor(element){
        this.node = element
    }

    pure(node){
        return new CustomElement(node)
    }

    buildNode(elementName){
        return this.pure(document.createElement(elementName))
    }

    withInnerText(text){
        this.node.innerText = text
        return this.pure(this.node)
    }

    withChild(customChild){
        this.node.append(customChild.node)
        return this.pure(this.node)
    }

    withChilds(customChildList){
        return customChildList.reduce((acc, child) => acc.withChild(child), this)
    }

    unwrap(){
        return this.node
    }
}

function generateHTML(){
    const root = new CustomElement(document.querySelector('#app')).withChilds(collections.map(collection => {

        const name = new CustomElement().buildNode('p').withInnerText(collection.name)

        const items = collection.items.map((itemName, index) => (
            new CustomElement().buildNode('li').withInnerText(itemName)
        ))

        const ul = new CustomElement().buildNode('ul').withChilds(items)

        const div = new CustomElement().buildNode('div').withChilds([name,ul])

        return div

    }))
}

generateHTML()

