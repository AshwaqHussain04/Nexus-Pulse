import React, { Component } from 'react'
import NavBar from './components/navbar'
import News from './components/news'
import { BrowserRouter as Router, Routes, Route, Form } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import './styles/App.css'
import { useState } from 'react';

export default class App extends Component {
    state = {
      progress: 0
    }
    Apikey = import.meta.env.VITE_REACT_APP_API_KEY

    setProgress = (progress)=>{
          this.setState({progress: progress})
    }
  render() {
    return (
      <div>
        <Router>
        <NavBar/>
        <LoadingBar
        color="#f11946"
        progress={this.state.progress}
        />
        <Routes>
            <Route path="/" element={<News setProgress={this.setProgress} Apikey={this.Apikey} country='us' pageSize={8} category= "general"/>}/> 
            <Route path="/business" element={<News setProgress={this.setProgress} Apikey={this.Apikey} country='us' pageSize={8} category= "business"/>} /> 
            <Route path="/entertainment" element={<News setProgress={this.setProgress} Apikey={this.Apikey} country='us' pageSize={8} category= "entertainment"/>} />
            <Route path="/health" element={<News setProgress={this.setProgress} Apikey={this.Apikey} country='us' pageSize={8} category= "health"/>} />
            <Route path="/science" element={<News setProgress={this.setProgress} Apikey={this.Apikey} country='us' pageSize={8} category= "science"/>} />
            <Route path="/sports" element={<News setProgress={this.setProgress} Apikey={this.Apikey} country='us' pageSize={8} category= "sports"/>} />
            <Route path="/technology" element={<News setProgress={this.setProgress} Apikey={this.Apikey} country='us' pageSize={8} category= "technology"/>} />
          </Routes>
        </Router>
      </div>
    )
  }
}

