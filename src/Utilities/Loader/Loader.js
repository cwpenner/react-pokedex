import React, { Component } from 'react';
import './Loader.css';

class Loader extends Component {
    // Displays a loading wheel
    
    render() {
        return (
            <span className="loader">
                <i className="fas fa-spinner"></i>
            </span> 
        );
    }
}

export default Loader;