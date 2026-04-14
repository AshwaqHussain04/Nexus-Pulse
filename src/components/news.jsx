import React, { Component } from "react";
import Newscomponent from "./newscomponent";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export default class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 12, // Increased to reduce API calls
    category: "Entertainment",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      offset: 0,
      totalResults: 0,
      hasMore: true,
      error: null,
      requestCount: this.getRequestCountFromStorage(),
      lastUpdated: null,
    };
    document.title = `${this.capitalizeFirstLetter(
      this.props.category
    )} - News Beacon`;
  }

  // MediaStack API configuration
  MEDIASTACK_API_KEY = "22bed9b52b3ea1565ae5f3a2c347575b";
  MEDIASTACK_BASE_URL = "https://api.mediastack.com/v1/news";
  CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Get request count from localStorage
  getRequestCountFromStorage = () => {
    const stored = localStorage.getItem("mediastack_request_count");
    const data = stored ? JSON.parse(stored) : { count: 0, date: new Date().toDateString() };
    
    // Reset count if it's a new day
    if (data.date !== new Date().toDateString()) {
      return { count: 0, date: new Date().toDateString() };
    }
    return data;
  };

  // Update request count in localStorage
  updateRequestCount = () => {
    const newCount = {
      count: this.state.requestCount.count + 1,
      date: new Date().toDateString(),
    };
    this.setState({ requestCount: newCount });
    localStorage.setItem("mediastack_request_count", JSON.stringify(newCount));
  };

  // Get cached data for a category
  getCachedData = (category) => {
    const cached = localStorage.getItem(`mediastack_cache_${category}`);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const now = new Date().getTime();

    // Check if cache is still valid
    if (now - data.timestamp < this.CACHE_DURATION) {
      console.log(`✓ Using cached data for ${category}`);
      return data.articles;
    }

    // Cache expired, remove it
    localStorage.removeItem(`mediastack_cache_${category}`);
    return null;
  };

  // Store cached data
  setCachedData = (category, articles) => {
    const cacheData = {
      articles: articles,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(`mediastack_cache_${category}`, JSON.stringify(cacheData));
  };

  async updateNews() {
    try {
      const category = this.props.category.toLowerCase();
      
      // Check cache first
      const cachedArticles = this.getCachedData(category);
      if (cachedArticles) {
        this.setState({
          articles: cachedArticles,
          loading: false,
          offset: this.props.pageSize,
          error: null,
          lastUpdated: "from cache",
        });
        return;
      }

      // Check if we're running low on requests
      if (this.state.requestCount.count >= 80) {
        this.setState({
          error: "⚠️ API limit almost reached (80/100). Using cached data. Request limit resets daily.",
          loading: false,
        });
        // Try to use any cached data
        const anyCached = this.getCachedData(category);
        if (anyCached) {
          this.setState({ articles: anyCached });
        }
        return;
      }

      this.props.setProgress(0);
      const url = `${this.MEDIASTACK_BASE_URL}?access_key=${this.MEDIASTACK_API_KEY}&categories=${category}&countries=in&limit=${this.props.pageSize}&offset=0`;
      this.props.setProgress(10);

      this.setState({ loading: true, error: null });

      const response = await fetch(url);
      
      this.props.setProgress(40);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      this.props.setProgress(70);

      // Update request count
      this.updateRequestCount();

      const articles = Array.isArray(data.data) ? data.data : [];

      // Cache the articles
      this.setCachedData(category, articles);

      this.setState({
        articles: articles,
        totalResults: data.pagination?.total || 0,
        loading: false,
        offset: this.props.pageSize,
        error: null,
        lastUpdated: new Date().toLocaleTimeString(),
      });

      this.props.setProgress(100);
    } catch (error) {
      console.error("Error fetching news:", error);
      this.setState({
        loading: false,
        error: `Failed to load articles: ${error.message}`,
      });
      this.props.setProgress(100);
    }
  }

  async componentDidMount() {
    this.updateNews();
  }

  // Update when category changes
  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      this.setState({
        articles: [],
        offset: 0,
        hasMore: true,
      });
      this.updateNews();
    }
  }

  fetchMoreData = async () => {
    try {
      // Check if we're running low on requests
      if (this.state.requestCount.count >= 95) {
        this.setState({
          hasMore: false,
          error: "⚠️ API limit reached! Cannot load more articles. Limit resets daily.",
        });
        return;
      }

      const newOffset = this.state.offset;
      this.props.setProgress(0);

      const category = this.props.category.toLowerCase();
      const url = `${this.MEDIASTACK_BASE_URL}?access_key=${this.MEDIASTACK_API_KEY}&categories=${category}&countries=in&limit=${this.props.pageSize}`;
      this.props.setProgress(10);

      this.setState({ loading: true });

      const response = await fetch(url);
      this.props.setProgress(60);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      this.props.setProgress(100);

      // Update request count
      this.updateRequestCount();

      const newArticles = Array.isArray(data.data) ? data.data : [];

      if (!newArticles || newArticles.length === 0) {
        this.setState({
          hasMore: false,
          loading: false,
        });
        return;
      }

      this.setState({
        articles: (this.state.articles || []).concat(newArticles),
        totalResults: data.pagination?.total || this.state.totalResults,
        offset: newOffset + this.props.pageSize,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching more news:", error);
      this.setState({
        hasMore: false,
        loading: false,
        error: `Failed to load more articles: ${error.message}`,
      });
      this.props.setProgress(100);
    }
  };

  render() {
    return (
      <>
        <div className="page-header">
          <div className="container">
            <h1 className="text-center">
              {this.capitalizeFirstLetter(this.props.category)} News
            </h1>
            <p className="text-center">
              Stay updated with the latest headlines
            </p>
          </div>
        </div>
        <div className="container my-4">
                      {this.state.error && (
              <div
                className="alert alert-danger alert-dismissible fade show shadow-sm"
                role="alert"
                style={{ transition: "all 0.3s ease" }}
              >
                <strong>⚠️ Notice:</strong> {this.state.error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => this.setState({ error: null })}
                  aria-label="Close"
                ></button>
              </div>
            )}
          <InfiniteScroll
            dataLength={this.state.articles?.length || 0}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={<Spinner />}
          >
            <div className="Container">
              <div className="row">
                {(this.state.articles || []).map((element, index) => {
                  return (
                    <div className="col-md-4" key={element.url || index}>
                      <Newscomponent
                        title={element.title || "No Title"}
                        description={element.description || "No description available"}
                        UrlImage={element.image}
                        url={element.url}
                        author={element.author || "Unknown"}
                        date={element.published_at}
                        source={element.source || "Unknown Source"}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </InfiniteScroll>
        </div>
      </>
    );
  }
}
