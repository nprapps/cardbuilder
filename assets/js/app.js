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
                <Embed selections={this.state.selections} ids={this.state.ids} key="Embed" />
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
            <div className="categories">
                {Object.keys(DATA).map(key => (
                    <CardList 
                        update={this.update}
                        category={key} 
                        cards={DATA[key]}
                        key={key}
                    />
                ))}
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
                <h1>{this.props.category}</h1>
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
                <label>
                    <input 
                        name={this.props.card.title} 
                        type="checkbox" 
                        checked={this.state.checked}
                        onClick={this.toggle}
                    />
                    {this.props.card.title}&nbsp;
                    <a href={`/admin/core/card/${this.props.card.id}/change`}>(edit)</a>
                </label>
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
        return <SortableList selections={this.props.selections} onSortEnd={this.onSortEnd} />;
    }
}


const SortableItem = SortableElement(({value}) =>
    <li>{value.title}</li>
);

const SortableList = SortableContainer(({selections}) => {
  return (
    <div className="selections">
        <ul>
          {selections.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} value={value} />
          ))}
        </ul>
    </div>
  );
});

class Embed extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="embed">
                {
                    this.props.selections.length > 0 ?
                    <iframe 
                        src={`https://s3.amazonaws.com/stage-apps.npr.org/dailygraphics/graphics/trump-card-wireframe-20170410/child.html?ids=${this.props.ids}`}
                    /> : null
                }
            </div>
        )
    }

}

ReactDOM.render(<App /> ,document.querySelector('#app'))