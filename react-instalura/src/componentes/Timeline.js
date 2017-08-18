import React, { Component } from 'react';
import Header from './Header';
import TimelineMain from './TimelineMain';

export default class Timeline extends Component {

  render() {
    return (
      <div>
        <Header />
        <TimelineMain login={this.props.match.params.login}/>
      </div>
    );
  }
}