import React from 'react';
import ReactDOM from 'react-dom';
import ReactBaseComponent from './reactBaseComponent';
import { s2m } from '../scripts/coverter';
import '../styles/main.scss';
import giphy from 'giphy-api';
import 'whatwg-fetch';
import { SlackToken } from '../scripts/secret';

const URL = 'https://slack.com/api/chat.postMessage';
const username = 'pomodoro-session';
const message = (messageType, task, isShowTask, gifUrl) => (
  isShowTask ? `${task} is ${messageType}! ${gifUrl}` : `${messageType}! ${gifUrl}`
);
const postMessageUrl = (channel, messageText) => (
  `${URL}?token=${SlackToken}&channel=${channel}&username=${username}&text=${messageText}`
);

class App extends ReactBaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      channelName: '',
      taskTitle: '',
      isStart: false,
      isBreak: false,
      time: this.props.duration,
      gifUrl: '',
    };
    this.bind('onClickToStart', 'onClickToEnd', 'tick', 'notification', 'onChangeText');
  }

  sendMessage(messageType, isShowTask) {
    const { channelName, taskTitle, gifUrl } = this.state;
    const messageText = message(messageType, taskTitle, isShowTask, gifUrl);
    fetch(postMessageUrl(channelName, messageText));
  }

  getGifUrl(gifType) {
    giphy({ apiKey: 'dc6zaTOxFJmzC' })
      .random(gifType)
      .then((res) => { this.setState({ gifUrl: res.data.fixed_height_downsampled_url }); });
  }

  onChangeText(key, value) {
    this.setState({ [key]: value });
  }

  notification(title) {
    const notification = new Notification(title);
    return notification;
  }

  onClickToStart() {
    if (!this.state.isStart) {
      this.interval = setInterval(this.tick, 1000);
      this.setState({ isStart: true });
      this.getGifUrl('start');
      this.sendMessage('started', true);
    } else {
      clearInterval(this.interval);
      this.setState({ isStart: false });
      this.getGifUrl('pause');
      this.sendMessage('paused', true);
    }
  }

  onClickToEnd() {
    this.end();
    this.getGifUrl('reset');
  }

  tick() {
    this.setState({ time: this.state.time - 1 });
    if (this.state.time === 0) {
      this.finishEvent();
    }
  }

  finishEvent() {
    if (this.state.isBreak) {
      this.end();
      this.notification('Break is over!');
      this.getGifUrl('back to work');
      this.sendMessage('back to work', false);
    } else {
      this.break();
      this.notification('Good work!');
      this.getGifUrl('Good work');
      this.sendMessage('DONE', false);
    }
  }

  break() {
    this.setState({ isStart: true, isBreak: true, time: this.props.breakTime, taskTitle: '' });
  }

  end() {
    clearInterval(this.interval);
    this.setState({ isStart: false, isBreak: false, time: this.props.duration });
  }

  render() {
    const { time, isStart, isBreak, taskTitle, gifUrl } = this.state;
    const isPause = !isStart && !isBreak && (time < this.props.duration);
    const taskTitleNode = (
      (isStart || isPause) ?
        <h3>{taskTitle === '' ? 'Untitled Task' : taskTitle}</h3> :
        <input
          type="text"
          placeholder="task"
          onChange={(e) => this.onChangeText('taskTitle', e.target.value)}
          value={this.state.taskTitle}
        ></input>
    );
    return (
      <div className="container">
        <div className="jumbotron main">
          <div className="box">
            <a href="https://slack.com/oauth/authorize?scope=identity.basic&client_id=43447285095.124901920753">
              <img
                alt=""
                height="40"
                width="172"
                src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
                srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
              />
            </a>
          </div>
          <img src="../images/pomo.png" width="128" height="128" alt="" />
          <div className="box">
            <input
              type="text"
              placeholder="channel name"
              onChange={(e) => this.onChangeText('channelName', e.target.value)}
              value={this.state.channelName}
            ></input>
          </div>
          <div className="box">
            {taskTitleNode}
          </div>
          <h2>{s2m(time)}</h2>
          <div>
            <button type="button" className="btn btn-primary" onClick={this.onClickToStart}>
              {isStart ? 'Pause' : 'Start'}
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={this.onClickToEnd}
            >
              End
            </button>
          </div>
          <img src={gifUrl} alt=""></img>
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
