import React from 'react';
import './App.css';
import {convertValue, Unit} from "./priceConverter";
import {isDOMComponent} from "react-dom/test-utils";




type UnitGroupProps = {
    default: Unit
}

type UnitGroupState = {
    commonUnit: Unit
    conversions: Array<String>
}

type UnitInputState = {
    value: number
    weight: number
    currentUnit: Unit
}
type UnitInputProps = {
    commonUnit: Unit
    saveCommand: Function
}

type HistoryProps = {
    previousCommands: Array<String>
    clearCommand: Function
}

function makeNumeric(str: String) {
    return  str.replace(/[^\d.]/g,'');
}

class UnitInputPane extends React.Component<UnitInputProps, UnitInputState> {
    constructor(props: UnitInputProps) {
        super(props);
        this.state = {value: 0, weight: 1, currentUnit: "kg"};

        this.onLocalUnitChange = this.onLocalUnitChange.bind(this)
        this.onNewValue = this.onNewValue.bind(this)
        this.onNewWeight = this.onNewWeight.bind(this)
        this.saveState = this.saveState.bind(this)
        this.resetFields = this.resetFields.bind(this);
    }

    onLocalUnitChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let newUnit = event.target.value as Unit
        this.setState({currentUnit: newUnit})
    }

    onNewValue(event: React.ChangeEvent<HTMLTextAreaElement>) {
        let strippedStr = makeNumeric(event.target.textContent || "");
        this.setState({value: Number.parseFloat(strippedStr || "0")});
        event.target.textContent = strippedStr;
    }

    onNewWeight(event: React.ChangeEvent<HTMLTextAreaElement>) {
        let strippedStr = makeNumeric(event.target.textContent || "");
        this.setState({weight: Number.parseFloat(strippedStr || "1")})
        event.target.textContent = strippedStr;
    }

    saveState() {
        const commonValue = this.generateFormattedValue();
        const command = "$" + commonValue + "/" + this.props.commonUnit;
        this.props.saveCommand(command);
    }

    resetFields() {
        this.setState({weight: 1, value: 0});
        let elems = document.getElementsByClassName("editValue");
        for (let edits in elems) {
            if (isDOMComponent(elems[edits])){
                elems[edits].textContent = "";
            }
        }
    }

    setPlaceholder() {
        let elems = document.getElementsByClassName("editValue");
                console.log("Trying")
        for (let edits in elems) {
            if (isDOMComponent(elems[edits])){
                elems[edits].textContent = (elems[edits].attributes.getNamedItem("placeholder") || "") as string;
            }
        }
    }

    generateFormattedValue(){
        let full_val = convertValue(this.state.value/this.state.weight, this.props.commonUnit, this.state.currentUnit);
        if (full_val < 1){
            return full_val.toPrecision(3);
        } else {
            return full_val.toFixed(2);
        }
    }

    render() {
        const commonValue = this.generateFormattedValue();
        return (
            <div id={"NOTmain"} className="grocery_banner">
                <div className={""} onLoad={this.setPlaceholder}>
                    <div className={"bottom_line"}>
                        <span>$</span><span data-testid={"price_box"} placeholder={"Enter Price"} contentEditable={"true"} className="editValue textarea" onInput={this.onNewValue} />
                    </div>
                    <div className={"top_line"}>
                    <span itemID={"enterWeight"} contentEditable={"true"} placeholder={"Enter Weight"} className="editValue weightarea" onInput={this.onNewWeight} />
                    {unitSelector(this.state.currentUnit, this.onLocalUnitChange)}
                    </div>
                </div>
                <div className={""}>
                    <span>$</span><label className="outputValue" contentEditable={false}>{commonValue}</label>
                    /{this.props.commonUnit}
                    <button onClick={this.saveState}>Save to History</button>
                    <button onClick={this.resetFields}>Reset</button>
                </div>

            </div>
        )
    }
}

function unitSelector(currentUnit: Unit, selectHandler: React.ChangeEventHandler<HTMLSelectElement>, prefix="") {
    return (<select value={currentUnit} className={"unit_selector"} onChange={selectHandler}>
        <option value="g">{prefix}g</option>
        <option value="kg">{prefix}kg</option>
        <option value="lb">{prefix}lb</option>
    </select>)
}


class HistoryPanel extends React.Component<HistoryProps> {

    constructor(props: HistoryProps) {
        super(props);
        this.clearHistory = this.clearHistory.bind(this);
    }

    clearHistory(){
        this.props.clearCommand()
    }

    render() {
        return (
            <div>
                <span className={"label"}>History:</span>
                {this.props.previousCommands.map((x: String, idx: number) => <div key={idx} className={"line"}> {x}</div>)}
                <button className={"action"} onClick={this.clearHistory} >Clear History</button>
            </div>
        );
    }
}

class UnitGroup extends React.Component<UnitGroupProps, UnitGroupState> {

    constructor(props: UnitGroupProps) {
        super(props);
        this.state = {commonUnit: props.default, conversions: [""]};
        this.onCommonUnitChange = this.onCommonUnitChange.bind(this);
        this.addToHistory = this.addToHistory.bind(this);
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
        })
    }

    addToHistory(newConversion: String) {
        this.state.conversions.push(newConversion);
        this.setState({conversions: this.state.conversions})
    }

    clearHistory(){
        this.setState({conversions: [""]})
    }

    render() {
        return (<div id={"idk"}>
            <div id={"main"}>
            <div id={"selUni"}>
                <span id={"topBar"}>Select Output Units:</span>
             {unitSelector(this.state.commonUnit, this.onCommonUnitChange, "per ")}
            </div>
            <UnitInputPane commonUnit={this.state.commonUnit} saveCommand={this.addToHistory.bind(this)}/>
            </div>
            <div id={"history"}>
            <HistoryPanel  previousCommands={this.state.conversions} clearCommand={this.clearHistory.bind(this)}/>
            </div>
        </div>)
    }
}


function App() {
    return (
        <div className="App">
            <UnitGroup default={"lb"}/>
        </div>
    );
}

export default App;
