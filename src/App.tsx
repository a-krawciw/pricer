import React from 'react';
import './App.css';
import {convertValue, Unit} from "./priceConverter";


type GroceryState = {
    value: number
    weight: number
    currentUnit: Unit
}
type GroceryProps = {
    commonUnit: Unit
}


class GroceryPane extends React.Component<GroceryProps, GroceryState> {
    constructor(props: GroceryProps) {
        super(props);
        this.state = {value: 0, weight: 1, currentUnit: "kg"};

        this.onLocalUnitChange = this.onLocalUnitChange.bind(this)
        this.onNewValue = this.onNewValue.bind(this)
        this.onNewWeight = this.onNewWeight.bind(this)
    }

    onLocalUnitChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let newUnit = event.target.value as Unit
        this.setState({currentUnit: newUnit})
    }

    onNewValue(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({value: Number.parseFloat(event.target.textContent || "nan")})
    }

    onNewWeight(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({weight: Number.parseFloat(event.target.textContent || "1")})
    }

    render() {
        const commonValue = convertValue(this.state.value/this.state.weight, this.props.commonUnit, this.state.currentUnit)
        return (
            <div id={"main"} className="grocery_banner">
                <div className={""}>
                    <div className={"bottom_line"}>
                        <span>$</span><span contentEditable={"true"} className="editValue textarea" onInput={this.onNewValue} />
                    </div>
                    <div className={"top_line"}>
                    <span contentEditable={"true"} className="editValue weightarea" onInput={this.onNewWeight} />
                    {unitSelector(this.state.currentUnit, this.onLocalUnitChange)}
                    </div>
                </div>
                <div className={"center"}>
                    <span>$</span><label className="outputValue" contentEditable={false}>{commonValue.toFixed(2)}</label>
                    /{this.props.commonUnit}
                </div>

            </div>
        )
    }
}

function unitSelector(currentUnit: Unit, selectHandler: React.ChangeEventHandler<HTMLSelectElement>) {
    return (<select value={currentUnit} className={"unit_selector"} onChange={selectHandler}>
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="lb">lb</option>
    </select>)
}

type UnitGroupProps = {
    default: Unit
}

type UnitGroupState = {
    commonUnit: Unit
}

class UnitGroup extends React.Component<UnitGroupProps, UnitGroupState> {

    constructor(props: UnitGroupProps) {
        super(props);
        this.state = {commonUnit: props.default};
        this.onCommonUnitChange = this.onCommonUnitChange.bind(this)
    }

    onCommonUnitChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let newUnit = event.target.value as Unit
        this.setState({commonUnit: newUnit})
        this.updateAllChildren(newUnit)
        console.log(newUnit)
    }

    updateAllChildren(newUnit: Unit) {
        let elems = Array.from(document.getElementsByClassName("commonUnit"));
        elems.forEach((elem) => {
            elem.removeAttribute('readonly');
            elem.innerHTML = newUnit;
            elem.setAttribute("readonly", "true");
            console.log(elem);
        })
    }

    render() {
        return (<div><h1>Select Output Units:</h1>
            {unitSelector(this.state.commonUnit, this.onCommonUnitChange)}
            <GroceryPane commonUnit={this.state.commonUnit}/>
        </div>)
    }
}


function App() {
    return (
        <div className="App">
            <UnitGroup default={"kg"}/>
        </div>
    );
}

export default App;
