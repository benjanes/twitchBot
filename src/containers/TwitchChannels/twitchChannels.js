import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getChannels } from '../../actions/items';

class ChannelDropdown extends Component {

  componentWillMount() {
    this.props.getChannels();
  }

  setChannel(channel) {
    this.props.setChannel(channel);
  }

  renderChannels(channelData) {
    const name = channelData.channel.name;
    const url = `https://www.twitch.tv/${name}`;
    return (
      <li key={name} onClick={this.setChannel(name).bind(this)}><a href={url}>{name}</a></li>
    );
  }

  render() {
    return (
      <div className="btn-group">
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Top Channels <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {this.props.channels.list.map(this.renderChannels)}
        </ul>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getChannels }, dispatch);
}

function mapStateToProps({ channels }) {
  return { channels };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelDropdown);
