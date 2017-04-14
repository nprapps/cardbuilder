// styles
import '../less/app.less'

// modules
import { h, render, Component } from 'preact'
import { PropTypes } from 'react';

let SELECTIONS = [];

class App extends Component {
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

        let joinedids = ''

        for (let i = 0; i < newSelections.length; i++) {
            if (i === newSelections.length - 1) {
                var comma = false
            } else {
                var comma = true
            }

            joinedids = joinedids + newSelections[i].id.toString()
            joinedids = comma ? joinedids + ',' : joinedids
        }

        this.setState({
            selections: newSelections,
            ids: joinedids
        })
    }

    render() {
        return(
            <div>
                <Categories update={this.updateSelections}/>
                <SelectionList selections={this.state.selections}/>
                <Embed selections={this.state.selections} ids={this.state.ids}/>
            </div>
        )
    }
}

class Categories extends Component {
    constructor(props) {
        super(props)
    }

    update = (card, action) => {
        this.props.update(card, action)
    }

    render() {
        return(
            <div class="categories">
                {Object.keys(DATA).map(key => (
                    <CardList 
                        update={this.update}
                        category={key} 
                        cards={DATA[key]}
                    />
                ))}
            </div>
        )
    }
}

class CardList extends Component {
    constructor(props) {
        super(props)
    }

    updateCard = (card, action) => {
        this.props.update(card, action)
    }

    render() {
        return(
            <div class="category">
                <h1>{this.props.category}</h1>
                {this.props.cards.map((card) => (
                    <Card update={this.updateCard} key={card.id} card={card} />
                ))}
            </div>
        )
    }
}

class Card extends Component {
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
            <div class="card" id={this.props.card.id}>
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

Categories.propTypes = {
    update: PropTypes.function
}

CardList.propTypes = {
    update: PropTypes.function
}

Card.propTypes = {
    update: PropTypes.function
}

class SelectionList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div class="selections">
                <ol>
                    {this.props.selections.map((selection) => (
                        <li>{selection.title}</li>
                    ))}
                </ol>
            </div>
        )
    }
}

class Embed extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div class="embed">
                { 
                    this.props.selections.length > 0 ? 
                    <p>{`https://apps.npr.org/dailygraphics/graphic/card-embed/child.html/?ids=${this.props.ids}`}</p>
                    : null
                }
            </div>
        )
    }

}

render(<App /> ,document.body)