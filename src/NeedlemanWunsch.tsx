import './NeedlemanWunsch.css';

import React, { Component } from 'react';

class NeedlemanWunsch extends Component<INeedlemanWunschProps, INeedlemanWunschState> {

    static x: number = 0;
    static y: number = 1;
    static z: number = 2;
    static minusInfinity: number = Number.NEGATIVE_INFINITY;

    // lhs: string;
    // rhs: string;

    // match    : number;
    // mismatch : number;
    // midopen  : number;
    // extension: number;
    // endopen  : number;

    mtrx: Array<Array<Array<number>>>;
    path: Array<Array<Array<number>>>;

    lhsSpaces: Array<number>;
    rhsSpaces: Array<number>;
    lhsResult: string;
    rhsResult: string;
    pathRecord: Array<Array<number>>;

    constructor(props: INeedlemanWunschProps) {
        super(props);

        // this.lhs = props.lhs;
        // this.rhs = props.rhs;

        // this.match     = props.match     ||  7 ;
        // this.mismatch  = props.mismatch  || -3 ;
        // this.midopen   = props.midopen   || -13;
        // this.extension = props.extension || -2 ;
        // this.endopen   = props.endopen   || -3 ;

        this.state = {
            lhs: props.lhs,
            rhs: props.rhs,
            match: props.scores[0],
            mismatch: props.scores[1],
            midopen: props.scores[2],
            extension: props.scores[3],
            endopen: props.scores[4]
        }

        this.mtrx = this._matrixesInit();
        this.path = this._matrixesInit();
        this._matrInit();
        this._pathInit();

        this.lhsSpaces = new Array<number>(this.state.lhs.length + 1);
        this.rhsSpaces = new Array<number>(this.state.rhs.length + 1);
        this.lhsResult = '';
        this.rhsResult = '';
        this.pathRecord = [];
    }

    _align(): void {
        // console.log("lhs: " + this.state.lhs);
        // console.log("rhs: " + this.state.rhs);
        this._dp();
        this._traceBack();
        // console.log(this.pathRecord);
        this.lhsResult = this._insertSpaces(this.props.lhs, this.lhsSpaces);
        this.rhsResult = this._insertSpaces(this.props.rhs, this.rhsSpaces);
        // console.log("lhs result: " + this.lhsResult);
        // console.log("rhs result: " + this.rhsResult);
    }

    _matrInit(): void {
        for (let i = 0; i <= this.state.lhs.length; ++i) {
            this.mtrx[i][0][NeedlemanWunsch.x] = this.state.endopen + i * this.state.extension;
            this.mtrx[i][0][NeedlemanWunsch.y] = this.mtrx[i][0][NeedlemanWunsch.z] = NeedlemanWunsch.minusInfinity;
        }
        for (let i = 0; i <= this.state.rhs.length; ++i) {
            this.mtrx[0][i][NeedlemanWunsch.x] = this.mtrx[0][i][NeedlemanWunsch.z] = NeedlemanWunsch.minusInfinity;
            this.mtrx[0][i][NeedlemanWunsch.y] = this.state.endopen + i * this.state.extension;
        }
        this.mtrx[0][0][NeedlemanWunsch.z] = 0;
    }

    _pathInit(): void {
        for (let i = 1; i <= this.state.lhs.length; ++i) this.path[i][0][NeedlemanWunsch.x] = NeedlemanWunsch.x;
        for (let i = 1; i <= this.state.rhs.length; ++i) this.path[0][i][NeedlemanWunsch.y] = NeedlemanWunsch.y;
    }

    _matrixesInit(): Array<Array<Array<number>>> {
        let matrixes = Array<Array<Array<number>>>(this.state.lhs.length + 1);
        for (let i = 0; i <= this.state.lhs.length; ++i) {
            matrixes[i] = new Array<Array<number>>(this.state.rhs.length + 1);
            for (let j = 0; j <= this.state.rhs.length; ++j) matrixes[i][j] = [0, 0, 0];
        }
        return matrixes;
    }

    _dp(): void {
        this.mtrx = this._matrixesInit();
        this.path = this._matrixesInit();
        this._matrInit();
        this._pathInit();
        let indexOfMax: number;
        let arr = [0, 0, 0];
        for (let i = 1; i <= this.state.lhs.length; ++i) {
            for (let j = 1; j <= this.state.rhs.length; ++j) {
                const open: number = i === this.state.lhs.length || j === this.state.rhs.length ? this.state.endopen : this.state.midopen;

                arr[NeedlemanWunsch.x] = this.mtrx[i - 1][j][NeedlemanWunsch.x];
                arr[NeedlemanWunsch.y] = this.mtrx[i - 1][j][NeedlemanWunsch.y] + open;
                arr[NeedlemanWunsch.z] = this.mtrx[i - 1][j][NeedlemanWunsch.z] + open;
                indexOfMax = this._indexOfMax(arr);
                this.mtrx[i][j][NeedlemanWunsch.x] = arr[indexOfMax] + this.state.extension;
                this.path[i][j][NeedlemanWunsch.x] = indexOfMax;

                arr[NeedlemanWunsch.x] = this.mtrx[i][j - 1][NeedlemanWunsch.x] + open;
                arr[NeedlemanWunsch.y] = this.mtrx[i][j - 1][NeedlemanWunsch.y];
                arr[NeedlemanWunsch.z] = this.mtrx[i][j - 1][NeedlemanWunsch.z] + open;
                indexOfMax = this._indexOfMax(arr);
                this.mtrx[i][j][NeedlemanWunsch.y] = arr[indexOfMax] + this.state.extension;
                this.path[i][j][NeedlemanWunsch.y] = indexOfMax;

                arr[NeedlemanWunsch.x] = this.mtrx[i - 1][j - 1][NeedlemanWunsch.x];
                arr[NeedlemanWunsch.y] = this.mtrx[i - 1][j - 1][NeedlemanWunsch.y];
                arr[NeedlemanWunsch.z] = this.mtrx[i - 1][j - 1][NeedlemanWunsch.z];
                indexOfMax = this._indexOfMax(arr);
                this.mtrx[i][j][NeedlemanWunsch.z] = arr[indexOfMax] + this._score(i - 1, j - 1);
                this.path[i][j][NeedlemanWunsch.z] = indexOfMax;
            }
        }
    }

    _traceBack(): void {
        this.lhsSpaces = new Array<number>(this.state.lhs.length + 1).fill(0);
        this.rhsSpaces = new Array<number>(this.state.rhs.length + 1).fill(0);
        this.pathRecord = [];
        let lhsIndex = this.state.lhs.length;
        let rhsIndex = this.state.rhs.length;
        let arr = [this.mtrx[lhsIndex][rhsIndex][NeedlemanWunsch.x],
        this.mtrx[lhsIndex][rhsIndex][NeedlemanWunsch.y],
        this.mtrx[lhsIndex][rhsIndex][NeedlemanWunsch.z]];
        let currPath = this._indexOfMax(arr);
        this.pathRecord.push([lhsIndex, rhsIndex, currPath]);
        while (lhsIndex > 0 || rhsIndex > 0) {
            switch (currPath) {
                case NeedlemanWunsch.x:
                    currPath = this.path[lhsIndex--][rhsIndex][currPath];
                    ++this.rhsSpaces[rhsIndex];
                    break;
                case NeedlemanWunsch.y:
                    currPath = this.path[lhsIndex][rhsIndex--][currPath];
                    ++this.lhsSpaces[lhsIndex];
                    break;
                case NeedlemanWunsch.z:
                    currPath = this.path[lhsIndex--][rhsIndex--][currPath];
                    break;
            }
            this.pathRecord.push([lhsIndex, rhsIndex, currPath]);
        }
    }

    _score(lhs: number, rhs: number): number {
        let lhsChar = this.state.lhs.charAt(lhs);
        let rhsChar = this.state.rhs.charAt(rhs);
        // if (lhsChar === "n" || rhsChar === "n") return 0; // TODO
        return lhsChar === rhsChar ? this.state.match : this.state.mismatch;
    }

    _indexOfMax(arr: number[]): number {
        let indexOfMax = 0;
        for (let i = 1; i < arr.length; ++i) if (arr[indexOfMax] < arr[i]) indexOfMax = i;
        return indexOfMax;
    }

    _insertSpaces(src: string, spaces: number[]): string {
        let result = "";
        for (let i = 0; i < src.length; ++i) {
            for (let j = 0; j < spaces[i]; ++j) result += '-';
            result += src[i];
        }
        for (let j = 0; j < spaces[src.length]; ++j) result += '-';
        return result;
    }

    static getDerivedStateFromProps(props: INeedlemanWunschProps, state: INeedlemanWunschState) {
        return {
            lhs: props.lhs,
            rhs: props.rhs,
            match: props.scores[0],
            mismatch: props.scores[1],
            midopen: props.scores[2],
            extension: props.scores[3],
            endopen: props.scores[4]
        }
    }

    render() {
        this._align();

        const resultHTML = () => {
            if (this.state.lhs !== "")
                return (
                    <div id="result">
                        <code>{this.lhsResult}</code>
                        <br></br>
                        <code>{this.rhsResult}</code>
                    </div>
                );
            else
                return (<></>);
        }

        const matrixFirstRow = () => {
            let result = [<td></td>, <td></td>];
            for (let i = 0; i < this.state.rhs.length; ++i) {
                result.push(
                    <td className="tableHead" id={"c" + (i + 1)}>{this.state.rhs[i]}</td>
                )
            }
            return result;
        }

        const matrixHTML = () => {
            if (this.state.lhs !== "") {
                let pathRecordIndex = this.pathRecord.length - 1;
                const determine = (i: number, j: number, k: number) => {
                    // console.log(pathRecordIndex);
                    let result = i === this.pathRecord[pathRecordIndex][0] && 
                                 j === this.pathRecord[pathRecordIndex][1] &&
                                 k === this.pathRecord[pathRecordIndex][2];
                    if (result && pathRecordIndex > 0) --pathRecordIndex;
                    return result;
                }

                return (
                    <section id="matrix">
                        <table><tbody>
                            <tr>{matrixFirstRow()}</tr>
                            {this.mtrx.map(((raw, i) => (
                                <tr>
                                    <td className="tableHead" id={"r" + i}>{i === 0 ? "" : this.state.lhs[i - 1]}</td>
                                    {raw.map((elem, j) => (
                                        <td
                                            id={"r" + i + "c" + j}
                                            onMouseEnter={this._handleMatrixElementMouseEnter.bind(this, i, j)}
                                            onMouseLeave={this._handleMatrixElementMouseLeave.bind(this, i, j)}
                                        >{elem.map((field, k) => (
                                            <p
                                                className={determine(i, j, k) ? "path" : ""}
                                                id={"r" + i + "c" + j + "p" + k}
                                                onMouseEnter={this._handleInnerMatrixElementMouseEnter.bind(this, i, j, k)}
                                                onMouseLeave={this._handleInnerMatrixElementMouseLeave.bind(this, i, j, k)}
                                            >{field === Number.NEGATIVE_INFINITY ? "-∞" : field}</p>
                                        ))}
                                        </td>
                                    ))}
                                </tr>
                            )))}
                        </tbody></table>
                    </section>
                );
            } else {
                return (<></>);
            }
        }

        const tip = () => {
            return (
                <div id="tip" className="tip-none">
                    <p>this is a tip</p>
                </div>
            )
        }

        return (
            <div>
                {resultHTML()}
                {matrixHTML()}
                {tip()}
            </div>
        );
    }

    // componentDidUpdate() {
    //     this._showPath();
    // }

    // _showPath() {
    //     for (let i = 0; i < this.pathRecord.length; ++i) {
    //         document.getElementById("r" + this.pathRecord[i][0] + "c" + this.pathRecord[i][1] + "p" + this.pathRecord[i][2])?.setAttribute("class", "path");
    //     }
    // }

    _handleMatrixElementMouseEnter(i: number, j: number): void {
        // console.log(i + " " + j);
        if (i > 0) this._setHighlighted(this._getRowHeadElementById(i));
        if (j > 0) this._setHighlighted(this._getColumnHeadElementById(j));
    }

    _handleMatrixElementMouseLeave(i: number, j: number): void {
        // console.log(i + " " + j);
        if (i > 0) this._unsetHighlighted(this._getRowHeadElementById(i))
        if (j > 0) this._unsetHighlighted(this._getColumnHeadElementById(j));
    }

    _handleInnerMatrixElementMouseEnter(i: number, j: number, k: number, event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>): void {
        // console.log(i + " " + j + " " + k);

        const setTip = (tipContent: string) : void => {
            let tip = document.getElementById("tip") as HTMLDivElement;
            (tip.firstChild as HTMLParagraphElement).innerHTML = tipContent;
            tip.className = event.clientX > document.body.clientWidth / 2 ? "tip-left" : "tip-right";
        }

        if (i > 0 && j > 0) {
            this._setHighlighted(this._getInnerMatrixOrigin(i, j, k));
            setTip(this._getMatchInfo(i, j, k));
        }

        if (i === 0 && j > 0 && k === 1) {
            this._setHighlighted(this._getInnerMatrixElementById(i, j - 1, k));
            setTip("extension " + this.state.extension);
        }

        if (i > 0 && j === 0 && k === 0) {
            this._setHighlighted(this._getInnerMatrixElementById(i - 1, j, k));
            setTip("extension " + this.state.extension);
        }

        if (i === 0 && j === 0)
        {
            if (k === 1) setTip("endopen " + this.state.endopen);
            if (k === 2) setTip("beginning " + 0);
        }
    }

    _getMatchInfo(i: number, j: number, k: number): string {
        if (k === NeedlemanWunsch.z)
            return this.state.lhs.charAt(i - 1) === this.state.rhs.charAt(j - 1) ? "match " + this.state.match : "mismatch " + this.state.mismatch;

        return k === this.path[i][j][k] ? "extension " + this.state.extension : 
                i === this.state.lhs.length || j === this.state.rhs.length ? "endopen " + (this.state.endopen + this.state.extension) :
                        "opengap " + (this.state.midopen + this.state.extension);
    }
    
    _handleInnerMatrixElementMouseLeave(i: number, j: number, k: number): void {
        // console.log(i + " " + j + " " + k);
        if (i > 0 && j > 0) this._unsetHighlighted(this._getInnerMatrixOrigin(i, j, k));
        if (i === 0 && j > 0 && k === 1) this._unsetHighlighted(this._getInnerMatrixElementById(i, j - 1, k));
        if (i > 0 && j === 0 && k === 0) this._unsetHighlighted(this._getInnerMatrixElementById(i - 1, j, k));
        (document.getElementById("tip") as HTMLDivElement).className = "tip-none";
    }

    _setHighlighted(element: HTMLElement): void {
        element.classList.add("highlighted");
    }

    _unsetHighlighted(element: HTMLElement): void {
        element.classList.remove("highlighted");
    }

    _getInnerMatrixOrigin(i: number, j: number, k: number): HTMLElement {
        switch (k) {
            case NeedlemanWunsch.x:
                return this._getInnerMatrixElementById(i - 1, j, this.path[i][j][k]);
            case NeedlemanWunsch.y:
                return this._getInnerMatrixElementById(i, j - 1, this.path[i][j][k]);
            default:
                return this._getInnerMatrixElementById(i - 1, j - 1, this.path[i][j][k]);
        }
    }

    _getInnerMatrixElementById(i: number, j: number, k: number): HTMLElement {
        return document.getElementById("r" + i + "c" + j + "p" + k) as HTMLElement;
    }

    _getMatrixElementById(i: number, j: number): HTMLElement {
        return document.getElementById("r" + i + "c" + j) as HTMLElement;
    }

    _getRowHeadElementById(i: number): HTMLElement {
        return document.getElementById("r" + i) as HTMLElement;
    }

    _getColumnHeadElementById(j: number): HTMLElement {
        return document.getElementById("c" + j) as HTMLElement;
    }

    // _handleMouseOver(/*event: React.MouseEvent*/) {
    //     // let tableHeads = document.getElementsByClassName("tableHead");
    //     // for (let i = 0; i < tableHeads.length; ++i)
    //     //     tableHeads[i].setAttribute("class", "highlighted");
    //     // console.log(document.getElementsByClassName("tableHead"));
    // }

}

export default NeedlemanWunsch;

interface INeedlemanWunschProps {
    lhs: string;
    rhs: string;
    scores: number[];
}

interface INeedlemanWunschState {
    lhs: string;
    rhs: string;
    match: number;
    mismatch: number;
    midopen: number;
    extension: number;
    endopen: number;
}
