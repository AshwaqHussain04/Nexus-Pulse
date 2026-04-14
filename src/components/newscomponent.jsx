import React, { Component } from 'react';
import Placeholder from "../images/Placeholder.png";
import '../styles/newscomponent.css';

export default class Newscomponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: props.UrlImage,
      imageAttempts: 0,
    };
  }

  componentDidMount() {
    // Validate and set initial image
    if (this.state.imageSrc) {
      this.validateAndSetImage(this.state.imageSrc);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.UrlImage !== this.props.UrlImage && this.props.UrlImage) {
      this.setState({ imageSrc: this.props.UrlImage, imageAttempts: 0 });
      this.validateAndSetImage(this.props.UrlImage);
    }
  }

  validateAndSetImage = (url) => {
    if (!url || url.trim() === '') {
      this.setState({ imageSrc: Placeholder });
      return;
    }

    // Check if URL starts with http/https
    if (!url.startsWith('http')) {
      this.setState({ imageSrc: Placeholder });
      return;
    }

    this.setState({ imageSrc: url });
  };

  // Handle image loading errors with smart fallback
  handleImageError = (e) => {
    const { imageAttempts } = this.state;
    
    // Try different strategies to load the image
    if (imageAttempts === 0) {
      console.warn("Image failed to load, using placeholder");
      this.setState({ imageSrc: Placeholder, imageAttempts: 1 });
    } else {
      // Final fallback
      this.setState({ imageSrc: Placeholder, imageAttempts: 2 });
    }
  };

  render() {
    let { title, description, url, author, date, source } = this.props;
    let { imageSrc } = this.state;

    let articlesData = date ? new Date(date) : new Date();

    return (
      <div className="card my-3">
        <span className="position-absolute top-0 translate-middle badge rounded-pill bg-dark" style={{left:'87%', zIndex: 1}}>
          {source || "Unknown"}
        </span>
        <div className="card-image-container">
          <img 
            src={imageSrc || Placeholder} 
            className="card-img-top" 
            alt={title || "News"} 
            onError={this.handleImageError}
            loading="lazy"
          />
        </div>
        <div className="card-body">
          <h5 className="card-title">{title || "No Title Available"}</h5>
          <p className="card-text">{description || "No description available"}</p>
          <p className="card-text">
            <small className="text-body-secondary">
              Last updated by {author || "Unknown"} at {articlesData.toUTCString()}
            </small>
          </p>
          <a 
            href={url || "#"} 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-primary"
            onClick={(e) => !url && e.preventDefault()}
          >
            Read More
          </a>
        </div>
      </div>
    );
  }
}
