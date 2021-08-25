import React from 'react';
import './App.css';
import {convertValue, Unit} from "./priceConverter";


type GroceryStore = "Thrifty" | "SaveOnFoods" | "CountryGrocer"
type GroceryState = {
    value: number
    weight: number
    currentUnit: Unit
}
type GroceryProps = {
    name: GroceryStore
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
        const name = this.props.name
        const commonValue = convertValue(this.state.value/this.state.weight, this.props.commonUnit, this.state.currentUnit)
        return (
            <div id={name + "_main"} className="grocery_banner center">
                <img src={process.env.PUBLIC_URL + "/img/" + name + ".png"} alt={"Logo for " + name}
                     className="groceryLogo"/>
                <div className={"center"}>
                    $<span contentEditable={"true"} className="editValue textarea" onInput={this.onNewValue} />
                    /<span contentEditable={"true"} className="editValue textarea" onInput={this.onNewWeight} >1</span>
                    {unitSelector(this.state.currentUnit, this.onLocalUnitChange)}
                </div>
                <div className={"center"}>
                    $<label className="outputValue" contentEditable={false}>{commonValue.toFixed(2)}</label>
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
        return (<div><h1>Set your output units</h1>
            {unitSelector(this.state.commonUnit, this.onCommonUnitChange)}
            <GroceryPane name={"Thrifty"} commonUnit={this.state.commonUnit}/>
            <GroceryPane name={"SaveOnFoods"} commonUnit={this.state.commonUnit}/>
            <GroceryPane name={"CountryGrocer"} commonUnit={this.state.commonUnit}/>
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
