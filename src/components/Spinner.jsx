import React, { Component } from 'react'
import loading from "../images/Loading.gif"
import '../styles/spinner.css'

export default class Spinner extends Component {
  render() {
    return (
      <div className="spinner-container">
        <div className="spinner-wrapper">
          <img src={loading} alt="loading" className="spinner-image" />
          <p className="spinner-text">Loading more articles...</p>
        </div>
      </div>
    )
  }
}
