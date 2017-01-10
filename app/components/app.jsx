import React from 'react';
import ReactDOM from 'react-dom';
import ReactBaseComponent from './reactBaseComponent';
import { s2m } from '../scripts/coverter';
import '../styles/main.scss';

class App extends ReactBaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      isStart: false,
      isBreak: false,
      time: this.props.duration,
    };
    this.bind('onClickToStart', 'onClickToReset', 'tick', 'notification');
  }

  notification(title) {
    const notification = new Notification(title);
    return notification;
  }

  onClickToStart() {
    if (!this.state.isStart) {
      this.interval = setInterval(this.tick, 1000);
      this.setState({ isStart: true });
    } else {
      clearInterval(this.interval);
      this.setState({ isStart: false });
    }
  }

  onClickToReset() {
    this.reset();
  }

  tick() {
    this.setState({ time: this.state.time - 1 });
    if (this.state.time === 0) {
      this.finishEvent();
    }
  }

  finishEvent() {
    if (this.state.isBreak) {
      this.reset();
      this.notification('Break is over!');
    } else {
      this.break();
      this.notification('Good work!');
    }
  }

  break() {
    this.setState({ isStart: true, isBreak: true, time: this.props.breakTime });
  }

  reset() {
    clearInterval(this.interval);
    this.setState({ isStart: false, isBreak: false, time: this.props.duration });
  }

  render() {
    const { isBreak, time, isStart } = this.state;
    return (
      <div className="container">
        <div className="jumbotron main">
          <h2>Pomodoro Timer</h2>
          <img
            src={isBreak ? '../assets/images/electron2.svg' : '../assets/images/electron.svg'}
            alt=""
            width="128px"
          ></img>
          <h2>{s2m(time)}</h2>
          <div>
            <button type="button" className="btn btn-primary" onClick={this.onClickToStart}>
              {isStart ? 'Pause' : 'Start'}
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={this.onClickToReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  duration: 1500,
  breakTime: 300,
};

ReactDOM.render(<App />, document.getElementById('root'));
