import React from 'react';
import ArticleDialog from '../Article/ArticleDialog';
import Tags from './Tags';
import { withRouter } from 'react-router-dom';

class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: null,
            activeFeed: this.props.match.url === '/' ? 'global' : 'my articles'
        }
    }

    fetchArticles = (url = '') => {
        fetch(`http://localhost:3001/api/articles/${url === 'global' ? '' : url }`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.authToken
            }
        })
        .then(res => res.json())
        .then(data => this.setState({ articles: data.articles || [] }));
    }

    componentDidMount() {
        if (this.state.activeFeed === 'my articles') {
            fetch(`http://localhost:3001/api/articles?user=${this.props.profile._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.authToken
                }
            })
            .then(res => res.json())
            .then(data => this.setState({ articles: data.articles || [] }));
        } else if (this.state.activeFeed === 'favourites') {
            fetch(`http://localhost:3001/api/users?favourites=true`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.authToken
                }
            })
            .then(res => res.json())
            .then(data => this.setState({ articles: data.favourites || [] }));
        } else {
            this.fetchArticles();
        }
    }

    handleClick = async (e) => {
        await this.setState({ activeFeed: e.target.name || "global" });
        
        if (this.state.activeFeed === 'my articles') {
            fetch(`http://localhost:3001/api/articles?user=${this.props.profile._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.authToken
                }
            })
            .then(res => res.json())
            .then(data => this.setState({ articles: data.articles || [] }));
        } else if (this.state.activeFeed === 'favourites') {
            fetch(`http://localhost:3001/api/users?favourites=true`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.authToken
                }
            })
            .then(res => res.json())
            .then(data => this.setState({ articles: data.favourites || [] }));
        } else {
            this.fetchArticles(this.state.activeFeed);
        }
    }

    render() {
        return this.props.isUser() && (
            <main className="feed-container">
                <div className="wrapper flex-between">
                    <aside className="feed">
                        <header className="feed-header">
                            {
                                this.props.feeds.map(feed => {
                                    return (
                                        <button
                                            className={`feed-btn ${this.state.activeFeed == feed ? 'feed-btn-active' : ''}`}
                                            onClick={this.handleClick}
                                            name={feed}
                                        >
                                            {feed.toUpperCase()}
                                        </button>
                                    )
                                })
                            }
                        </header>
                        <main>
                            <ArticleDialog isUser={this.props.isUser} articles={this.state.articles} />
                        </main>
                        <footer>
                            <div className="paginate flex-start">
                                <a href="#" className="page current-page">
                                    <button>1</button>
                                </a>
                                <a href="#" className="page">
                                    <button>2</button>
                                </a>
                                <a href="#" className="page">
                                    <button>3</button>
                                </a>
                            </div>
                        </footer>
                    </aside>
                    {
                        this.props.match.url.length > 1 ? '' : (
                            <aside className="popular-tags-container">
                                <h5>Popular tags</h5>
                                <Tags />
                            </aside>
                        )
                    }
                </div>
            </main>
        );
    }
}

export default withRouter(Feed);