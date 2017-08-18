import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
    <div id="root">
      <div className="main">
        {this.props.children}
      </div>
    </div>
    );
  }
}

export default App;
