import React, { Component, useLayoutEffect } from 'react';

export class Sidebar extends Component {
    render() {		
        return (
			<aside className={this.props.asideClass}>
				<h2>Items to match</h2>
				<button id="show-sidebar" onClick={() => this.props.showSidebar()}>Show</button>
				<button id="hide-sidebar" onClick={() => this.props.hideSidebar()}>Hide</button>
				<div id="aside-tables">
					{this.props.children}
				</div>
			</aside>
			
        );
    }
}

export default Sidebar;
