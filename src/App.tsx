import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import Input from './Input';
import NeedlemanWunsch from './NeedlemanWunsch';

class App extends Component<any, IAppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      lhs: "",
      rhs: "",
      scores: []
    }
  }

  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.<br></br>
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
        <Input onSubmitHandler={ this._submit.bind(this) } />
        <NeedlemanWunsch lhs={ this.state.lhs } rhs={ this.state.rhs } scores={ this.state.scores } />
      </div>
    );
  }
    
  _submit(lhs: string, rhs: string, scores: number[]) {
    this.setState({
      lhs: lhs,
      rhs: rhs,
      scores: scores
    })
  }

}

interface IAppState {
  lhs: string;
  rhs: string;
  scores: number[];
}

export default App;
