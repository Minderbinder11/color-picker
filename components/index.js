import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import ColorFamilyView from './ColorFamilyView.js';
import ColorFamilyInfoView from './ColorFamilyInfoView.js';
import FilterBar from './FilterBar.js';
import {Grid} from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFilter: 'mostClicked',
      currentFamily: {},
      colorFamilies: [],
      allFamilies: [],
      toggleSidebar: false
    };

    this.handleStateChange = this.handleStateChange.bind(this);
  }

  hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16)
    } : null;
  }

  handleStateChange (color) {
    var filteredColorFamilies = [];
    this.setState({
      currentFilter: color,
    });
    this.state.allFamilies.forEach(function (obj) {
      var include = false;
      for (var key in obj) {
        if (key.slice(0,5) === 'color') {
          var colorRgb = this.hexToRGB(obj[key], 16);
          if (color === 'red') {
            if (colorRgb.red > (1.5 * colorRgb.blue) && colorRgb.red > (1.5 * colorRgb.green))
              include = true;
          }
          if (color === 'blue') {
            if (colorRgb.blue > (1.5 * colorRgb.red) && colorRgb.blue > (1.5 * colorRgb.green))
              include = true;
          }
          if (color === 'green') {
            if (colorRgb.green > (1.5 * colorRgb.blue) && colorRgb.green > (1.5 * colorRgb.red))
              include = true;
          }
        }
      }
      if (include === true) {
        filteredColorFamilies.push(obj)
      }
    }.bind(this))
    this.setState({
      colorFamilies: filteredColorFamilies
    });
  }

  setCurrentFamily(familyData) {
    this.setState({
      currentFamily: familyData
    });
  }

  componentWillMount() {
    $.ajax({
      url: '/api/colors',
      success: function(data) {
        this.setState({ colorFamilies: data });
        this.setState({ allFamilies: data });
      }.bind(this),
      dataType: 'JSON'
    });
  }

  render() {
    return (
      <div className="app-body">
        <FilterBar className="app-nav" handleStateChange={this.handleStateChange} currentFilter={this.state.currentFilter} />
        <div>
          <div className="app-main">
            <ColorFamilyView setCurrentFamily={this.setCurrentFamily.bind(this)} colorFamilies={this.state.colorFamilies}/>
          </div>
          <div className="app-sidebar">
            <ColorFamilyInfoView currentFamily={this.state.currentFamily}/>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);