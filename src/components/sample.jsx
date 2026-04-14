import React, { Component } from 'react';
import Newscomponent from './newscomponent';

export default class News extends Component {
  constructor() {
    super();
    this.state = {
      articles: [  // Your articles array goes here
        {
          source: { id: "bbc-sport", name: "BBC Sport" },
          title: "England vs India cricket LIVE: Second Test",
          description: "England face India in the second Test at Edgbaston...",
          url: "http://www.bbc.co.uk/sport/cricket/live/c3evkp03j43t",
          urlToImage: "https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/521c/live/81b10e30-57ef-11f0-9074-8989d8c97d87.jpg"
        },
        {
          source: { id: "al-jazeera-english", name: "Al Jazeera English" },
          title: "Hindu pilgrimage begins in Kashmir",
          description: "Security has been beefed up for this pilgrimage...",
          url: "https://www.aljazeera.com/news/2025/7/3/hindu-pilgrimage-begins-in-kashmir",
          urlToImage: "https://www.aljazeera.com/wp-content/uploads/2025/07/13165559-1751531372.jpg?resize=1920%2C1440"
        }
        // add more articles from your list if needed
      ]
    };
  }

  render() {
    return (
      <div className="container my-4">
        <h1 className="text-center mb-4">DAILY NEWS</h1>
        <div className="row">
          {this.state.articles.map((element, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <Newscomponent
                title={element.title}
                description={element.description}
                UrlImage={element.urlToImage}
                newsUrl={element.url}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
