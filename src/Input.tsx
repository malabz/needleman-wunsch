import React, { Component } from 'react';

import './Input.css';

class Input extends Component<IInputProps> {

    render() {
        return (
            <div id="inputMain">
                <div id="inputArea">
                    <div className="inputTable" id="sequence">
                        <div className="tableRow">
                            <p>lhs: </p>
                            <p><textarea id="lhs" onFocus={(e) => {e.target.placeholder=""}}></textarea></p>
                        </div>
                        <div className="tableRow">
                            <p>rhs: </p>
                            <p><textarea id="rhs" onFocus={(e) => {e.target.placeholder=""}}></textarea></p>
                        </div>
                    </div>
                    <div className="inputTable" id="score">
                        <div className="tableRow">
                            <p>match: </p>
                            <p><input type="number" defaultValue={Input.defaultScores[0]} id="score0" onChange={this._handleScoreChange.bind(this)}></input></p>
                        </div>
                        <div className="tableRow">
                            <p>mismatch: </p>
                            <p><input type="number" defaultValue={Input.defaultScores[1]} id="score1" onChange={this._handleScoreChange.bind(this)}></input></p>
                        </div>
                        <div className="tableRow">
                            <p>mid-open: </p>
                            <p><input type="number" defaultValue={Input.defaultScores[2]} id="score2" onChange={this._handleScoreChange.bind(this)}></input></p>
                        </div>
                        <div className="tableRow">
                            <p>extension: </p>
                            <p><input type="number" defaultValue={Input.defaultScores[3]} id="score3" onChange={this._handleScoreChange.bind(this)}></input></p>
                        </div>
                        <div className="tableRow">
                            <p>end-open: </p>
                            <p><input type="number" defaultValue={Input.defaultScores[4]} id="score4" onChange={this._handleScoreChange.bind(this)}></input></p>
                        </div>
                    </div>
                </div>

                <div id="inputButton">
                    <p>
                        <button onClick={this._handleSubmit.bind(this)}>submit</button>
                        <button onClick={this._hanldeClear.bind(this)}>clear</button>
                    </p>
                </div>
            </div>
        )
    }

    _handleScoreChange() {
        this._handleSubmit(null);
    }

    _hanldeClear(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        (document.getElementById("lhs") as HTMLTextAreaElement).value = "";
        (document.getElementById("rhs") as HTMLTextAreaElement).value = "";

        (document.getElementById("lhs") as HTMLTextAreaElement).placeholder = "";
        (document.getElementById("rhs") as HTMLTextAreaElement).placeholder = "";

        for (let i = 0; i < Input.scoreNumber; ++i)
            (document.getElementById("score" + i) as HTMLInputElement).value = Input.defaultScores[i].toString();

        this.props.onSubmitHandler("", "", Input.defaultScores);
    }

    _handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null) {
        // console.log("submit");
        let checkSequence = true;

        let lhs = (document.getElementById("lhs") as HTMLTextAreaElement).value.trim();
        if (lhs === "") {
            if (event) (document.getElementById("lhs") as HTMLTextAreaElement).placeholder = "cannot be blank";
            checkSequence = false;
        }
        let rhs = (document.getElementById("rhs") as HTMLTextAreaElement).value.trim();
        if (rhs === "") {
            if (event) (document.getElementById("rhs") as HTMLTextAreaElement).placeholder = "cannot be blank";
            checkSequence = false;
        }

        let scores: number[] = [];
        for (let i = 0; i < Input.scoreNumber; ++i) {
            let input = (document.getElementById("score" + i) as HTMLInputElement).value.trim();
            let score = Number(input)
            if (input === "" || isNaN(score)) {
                scores.push(Input.defaultScores[i]);
                (document.getElementById("score" + i) as HTMLInputElement).value = Input.defaultScores[i].toString();
            }
            else {
                scores.push(score);
            }
        }

        if (checkSequence) this.props.onSubmitHandler(lhs, rhs, scores);
    }

    static defaultScores = [7, -3, -11, -2, -3];
    static scoreNumber = 5;
}

export default Input;

interface IInputProps {
    onSubmitHandler: (lhs: string, rhs: string, scores: number[]) => void;
}
