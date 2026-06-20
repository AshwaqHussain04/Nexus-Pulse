import React, { Component } from "react";
import Placeholder from "../images/Placeholder.png";
import TwitterLogo from "../images/x_logo.jpg";
import FacebookLogo from "../images/Facebook_f_logo_(2021).svg.webp";
import LinkedInLogo from "../images/linkedin_logo_icon_147268.webp";
import "../styles/newscomponent.css";

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
    if (!url || url.trim() === "") {
      this.setState({ imageSrc: Placeholder });
      return;
    }

    // Check if URL starts with http/https
    if (!url.startsWith("http")) {
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

  // Share button handlers
  shareOnTwitter = () => {
    const { title, url, source } = this.props;
    const text = `Check out: ${title || "this news"} from ${source || "this source"}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url || "")}`;
    window.open(twitterUrl, "_blank", "width=1280,height=720");
  };

  shareOnFacebook = () => {
    const { url } = this.props;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url || "")}`;
    window.open(facebookUrl, "_blank", "width=1280600,height=720");
  };

  shareOnLinkedIn = () => {

    const { title, url, source } = this.props;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url || "")}&title=${encodeURIComponent(title || "News Article")}&summary=${encodeURIComponent(source || "")}`;
    window.open(linkedInUrl, "_blank", "width=1280600,height=720");
  };

  copyToClipboard = () => {
    const { url } = this.props;
    if (url) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch(() => {
          alert("Failed to copy link");
        });
    }
  };

  render() {
    let { title, description, url, author, date, source } = this.props;
    let { imageSrc } = this.state;

    let articlesData = date ? new Date(date) : new Date();

    return (
      <div className="card my-3">
        <span
          className="position-absolute top-0 translate-middle badge rounded-pill bg-dark"
          style={{ left: "87%", zIndex: 1 }}
        >
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
          <p className="card-text">
            {description || "No description available"}
          </p>
          <p className="card-text">
            <small className="text-body-secondary">
              Last updated by {author || "Unknown"} at{" "}
              {articlesData.toUTCString()}
            </small>
          </p>
          <div className="card-actions">
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
          <div className="share-buttons-container">
            <button
              className="share-btn share-twitter"
              onClick={this.shareOnTwitter}
              title="Share on Twitter/X"
            >
              <img src={TwitterLogo} alt="Twitter" className="share-logo" />
            </button>
            <button
              className="share-btn share-facebook"
              onClick={this.shareOnFacebook}
              title="Share on Facebook"
            >
              <img src={FacebookLogo} alt="Facebook" className="share-logo" />
            </button>
            <button
              className="share-btn share-linkedin"
              onClick={this.shareOnLinkedIn}
              title="Share on LinkedIn"
            >
              <img src={LinkedInLogo} alt="LinkedIn" className="share-logo" />
            </button>
            <button
              className="share-btn share-copy"
              onClick={this.copyToClipboard}
              title="Copy link"
            >
              <span className="share-icon">🔗</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
