import React from 'react';
import ReactDOM from 'react-dom';
import ReactBaseComponent from './reactBaseComponent';

class App extends ReactBaseComponent {
  render() {
    return (
      <p>hi</p>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
