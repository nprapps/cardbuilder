// styles
import '../less/app.less'

// modules
import React from 'react';
import ReactDOM from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

let SELECTIONS = [];

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selections: []
        }
    }

    updateSelections = (selection, action) => {
        let newSelections = this.state.selections.slice()

        if (action) {
            newSelections.push(selection)        
        } else {
            const i = newSelections.indexOf(selection)
            newSelections.splice(i, 1)
        }

        const joinedids = this.joinIDs(newSelections)

        this.setState({
            selections: newSelections,
            ids: joinedids
        })
    }

    updateOrder = (selections) => {
        const joinedids = this.joinIDs(selections)

        this.setState({
            selections: selections,
            ids: joinedids
        })

    }

    joinIDs = (selections) => {
        let joinedids = ''

        for (let i = 0; i < selections.length; i++) {
            if (i === selections.length - 1) {
                var comma = false
            } else {
                var comma = true
            }

            joinedids = joinedids + selections[i].id.toString()
            joinedids = comma ? joinedids + ',' : joinedids
        }

        return joinedids
    }

    render() {
        return(
            <div>
                <Categories update={this.updateSelections} key="Categories" />
                <SelectionList selections={this.state.selections} update={this.updateOrder} key="SelectionList" />
                
                { this.state.selections.length > 0 ? <Embed selections={this.state.selections} ids={this.state.ids} key="Embed" /> : null }
            </div>
        )
    }
}

class Categories extends React.Component {
    constructor(props) {
        super(props)
    }

    update = (card, action) => {
        this.props.update(card, action)
    }

    render() {
        return(
            <div className="row categories-wrapper">
                <div className="row-label">
                    <h1>1. Select your cards</h1>
                </div>
                <div className="categories row-interaction">
                    {Object.keys(DATA).map(key => (
                        <CardList 
                            update={this.update}
                            category={key} 
                            cards={DATA[key]}
                            key={key}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

class CardList extends React.Component {
    constructor(props) {
        super(props)
    }

    updateCard = (card, action) => {
        this.props.update(card, action)
    }

    render() {
        return(
            <div className="category">
                <h2>{this.props.category}</h2>
                {this.props.cards.map((card) => (
                    <Card update={this.updateCard} key={card.id} card={card} />
                ))}
            </div>
        )
    }
}

class Card extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false
        }
    }

    toggle = e => {
        let checked = !this.state.checked
        this.setState({ checked })
        this.props.update(this.props.card, checked);
    }

    render() {
        return(
            <div className="card" id={this.props.card.id}>
                <p>
                        <input 
                            id={this.props.card.title}
                            name={this.props.card.title} 
                            type="checkbox" 
                            checked={this.state.checked}
                            onClick={this.toggle}
                        />
                        <label htmlFor={this.props.card.title}>
                        {this.props.card.title}&nbsp;
                        <a target="_blank" href={`/admin/core/card/${this.props.card.id}/change`}>edit</a>
                        </label>
                </p>
            </div>
        )
    }
}

class SelectionList extends React.Component {
    constructor(props) {
        super(props)
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        const updated = arrayMove(this.props.selections, oldIndex, newIndex)
        this.props.update(updated)
    };
    render() {
        return (
            <div className="row selection-wrapper">
                <div className="row-label">
                    <h1>2. Order your cards</h1>
                </div>
                <div className="row-interaction selection-list">
                    <SortableList selections={this.props.selections} onSortEnd={this.onSortEnd} lockAxis="y" helperClass="sorting"/>
                </div>
            </div>
        )
    }
}


const SortableItem = SortableElement(({value}) => 
    <li>{value.title}</li>
);

const SortableList = SortableContainer(({selections}) => {
  return (
    <div className="selections">
        { selections.length > 0 ? 
            <ol>
              {selections.map((value, index) => (
                <SortableItem key={`item-${index}`} index={index} value={value} />
              ))}
            </ol> :
            'Select a card!'
        }
        
    </div>
  );
});

class Embed extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.initEmbed()
    }

    componentDidUpdate() {
        this.initEmbed()
    }

    initEmbed() {
        new pym.Parent(
            'card-embed', 
            `https://s3.amazonaws.com/stage-apps.npr.org/dailygraphics/graphics/trump-card-wireframe-20170410/child.html?ids=${this.props.ids}`, 
            {}
        )
    }

    render() {        
        return (
            <div className="row embed-wrapper">
                <div className="row-label">
                    <h1>3. Preview your embed</h1>
                </div>
                <div className="row-interaction">
                    <div id="card-embed"></div>
                </div>
            </div>
        )
    }

}

ReactDOM.render(<App /> ,document.querySelector('#app'))