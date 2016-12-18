import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import ColorFamilyView from './ColorFamilyView.js';
import ColorFamilyInfoView from './ColorFamilyInfoView.js';
import CreateYourOwn from './CreateYourOwn.js';
import FilterBar from './FilterBar.js';
import Preview from './Preview.js';
import {Button, Grid} from 'react-bootstrap';
import { Router, Route, Link, browserHistory } from 'react-router';
import ColorBox from './ColorBox.js';
import colorList from '../client/assets/colors.js';
import ColorRow from './ColorRow.js';
import colorStore from './colorStore.js';
import ComplementaryRow from './ComplementaryRow.js';
import Swatch from './Swatch.js';
import { observer } from 'mobx-react';
import { HEXtoRGB } from './colorCalcHelpers.js'
import TriadRow from './TriadRow.js';
import TetradRow from './TetradRow.js';
import MonoChromeRow from './MonoChromeRow.js';

//this app relies heavily on React Bootstrap
//https://react-bootstrap.github.io/ for the documentation

var App = observer( class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFilter: 'mostClicked',
      currentFamily: {},
      colorFamilies: [],
      allFamilies: [],
      appClass: 'app-main-full',
      sidebarClass: 'app-sidebar-hidden',
      createClass: 'create-family-hidden'
    };
    this.handleStateChange = this.handleStateChange.bind(this);
    this.toggleSidebarOn = this.toggleSidebarOn.bind(this);
    this.toggleSidebarOff = this.toggleSidebarOff.bind(this);
    this.toggleSubmitForm = this.toggleSubmitForm.bind(this);
  }


  //Filter display based on navbar choices
  // we can probably remove this one all together since we are 
  handleStateChange (color) {
    var filteredColorFamilies = [];

    this.setState({
      currentFilter: color,
    });

    // this.state.allFamilies.forEach(function (obj) {
    //   var include = false;
    //   for (var key in obj) {
    //     if (key.slice(0, 5) === 'color') {
    //       var colorRgb = this.HEXtoRGB(obj[key], 16);
    //       if (color === 'red') {
    //         if (colorRgb.red > (1.5 * colorRgb.blue) && colorRgb.red > (1.5 * colorRgb.green))
    //           include = true;
    //       }
    //       if (color === 'blue') {
    //         if (colorRgb.blue > (1.5 * colorRgb.red) && colorRgb.blue > (1.5 * colorRgb.green))
    //           include = true;
    //       }
    //       if (color === 'green') {
    //         if (colorRgb.green > (1.5 * colorRgb.blue) && colorRgb.green > (1.5 * colorRgb.red))
    //           include = true;
    //       }
    //       if (color === 'all') {
    //         include = true;
    //       }
    //     }
    //   }
    //   if (include === true) {
    //     filteredColorFamilies.push(obj);
    //   }
    // }.bind(this));
    // this.setState({
    //   colorFamilies: filteredColorFamilies
    // });
  }

  setCurrentFamily(familyData) {
    this.setState({
      currentFamily: familyData
    });
    console.log('these are app state', this.state);
  }

  toggleSubmitForm() {
    if (this.state.createClass === 'create-family-hidden') {
      this.setState({createClass: 'create-family-show'});
    } else {
      this.setState({createClass: 'create-family-hidden'});
    }
  }

  //Change state of components to display side via css

  toggleSidebarOn() {
    this.setState({
      sidebarClass: 'app-sidebar',
      appClass: 'app-main'
    });
    console.log('toggle on');
  }

  toggleSidebarOff() {
    this.setState({
      sidebarClass: 'app-sidebar-hidden',
      appClass: 'app-main-full'
    });
    console.log('toggle off');
  }

  //load data before render
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
    var colorArray = [['#F9EBEA', '#FDEDEC'], ['#F2D7D5', '#FADBD8']];


    var styles = {
      background: {
        backgroundColor: colorStore.currentColor,
        height: 40,
        width: 40
      }
    };


    return (


      <div className="app-body">
        <FilterBar className="app-nav" handleStateChange={this.handleStateChange} currentFilter={this.state.currentFilter} toggleSubmit={this.toggleSubmitForm} />

        <div className="app-main">
          <div className="color-grid">
            {colorList.map((colorRow, index) =>
               <ColorRow colors={colorRow} key={index} row={index}/>
            )}
          </div>
          <div className="app-main-pallets">
            <ComplementaryRow />
            <TriadRow />
            <TetradRow />
            <MonoChromeRow />
          </div>
        </div>
        <div className="app-sidebar"> {/*  changing this to "app-sidebar-hidden" will hide this */}
          <div className="passing-color" style={styles.background} />
            <ColorFamilyInfoView currentFamily={this.state.currentFamily} />
        </div>
    </div>

    );
  }
})

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
    <Route path="/preview" component={Preview}/>
  </Router>,
  document.getElementById('root')
);
