import React, { Component } from 'react';

import './Input.css';

class Input extends Component<IInputProps> {

    render() {
        return (
            <div id="input">
                <div className="tableRow">
                    <p>lhs: </p>
                    <p><textarea id="lhs" onFocus={(e) => {e.target.placeholder=""}}></textarea></p>
                </div>
                <div className="tableRow">
                    <p>rhs: </p>
                    <p><textarea id="rhs" onFocus={(e) => {e.target.placeholder=""}}></textarea></p>
                </div>
                <div className="tableRow">
                    <p></p>
                    <p>
                        <button onClick={this._handleSubmit.bind(this)}>submit</button>
                        <button onClick={this._hanldeClear.bind(this)}>clear</button>
                    </p>
                </div>
            </div>
        )
    }

    _hanldeClear(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        (document.getElementById("lhs") as HTMLTextAreaElement).value = "";
        (document.getElementById("rhs") as HTMLTextAreaElement).value = "";
        (document.getElementById("lhs") as HTMLTextAreaElement).placeholder = "";
        (document.getElementById("rhs") as HTMLTextAreaElement).placeholder = "";
        this.props.onSubmitHandler("", "");
    }

    _handleSubmit() {
        // console.log("submit");
        let lhs = (document.getElementById("lhs") as HTMLTextAreaElement).value.trim();
        let rhs = (document.getElementById("rhs") as HTMLTextAreaElement).value.trim();
        if (lhs !== "" && rhs !== "") {
            this.props.onSubmitHandler(lhs, rhs);
        } else {
            if (lhs === "") (document.getElementById("lhs") as HTMLTextAreaElement).placeholder = "cannot be blank";
            if (rhs === "") (document.getElementById("rhs") as HTMLTextAreaElement).placeholder = "cannot be blank";
        }
    }

}

export default Input;

interface IInputProps {
    onSubmitHandler: (lhs: string, rhs: string) => void;
}
