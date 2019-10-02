import React from 'react';
import Comment from '../Comment/Comment';
import { withRouter } from 'react-router-dom';

class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            article: null
        }
    }

    componentDidMount() {
        fetch(`http://localhost:3001/api/${this.props.match.url}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${ localStorage.authToken }`
            }
        })
        .then(res => res.json())
        .then( ({ article }) => this.setState({ article }))
        .catch(err => console.log(err) )
    }

    render() {
        return (
            <React.Fragment>
               {
                   this.state.article &&

                   (
                   <React.Fragment>
                    <section className="article">
                            <div className="wrapper">
                                <header className="article-header">
                                    <h2>{this.state.article.title}</h2>
                                    <div className="flex-start article-card">
                                        <div className="author flex-start">
                                            <img className="author-avatar" src={this.state.article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}></img>
                                            <div className="article-details flex-start">
                                                <a>
                                                    <span className="author-username">{this.state.article.author.username}</span>
                                                </a>
                                                <span className="article-created-on">{new Date(this.state.article.createdAt).toDateString()}</span>
                                            </div>
                                        </div>
                                        <button className="follow-btn">
                                            <span>+</span>
                                            <span> Follow {this.state.article.author.username}</span>
                                        </button>
                                        <button className="like-btn">
                                            <span className="heart">♥</span>
                                            <span className="like-count">{this.state.article.likes}</span>
                                        </button>
                                    </div>
                                </header>
                            </div>
                        </section>
                        <section className="article-description">
                            <div 
                                className="wrapper"
                                dangerouslySetInnerHTML={{ __html: this.state.article.description }}
                            >
                            </div>
                        </section>
                        <Comment isUser={this.props.isUser}/>
                   </React.Fragment>
                )
               }
            </React.Fragment>
        );
    }
}

export default withRouter(Article);