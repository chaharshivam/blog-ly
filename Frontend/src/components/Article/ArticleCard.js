import React from 'react';
import { Link } from 'react-router-dom';
import Article from './Article';

function ArticleCard(props) {
    return (
        <div className="article-dialog">
            <header className="flex-between article-dialog-header">
                <div className="author flex-start">
                    <img className="author-avatar" src={props.article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} />
                    <div className="article-details flex-start">
                        <Link to={`/users/${props.article.author.username}`}>
                            <span className="author-username">{props.article.author.username}</span>
                        </Link>
                        <span className="article-created-on">{new Date(props.article.createdAt).toDateString()}</span>
                    </div>
                </div>
                <button className="like-btn">
                    <span className="heart">♥</span>
                    <span className="like-count">{props.article.likes}</span>
                </button>
            </header>
            <main>
                {
                    <h4 className="article-dialog-heading">
                        {props.article.title}
                    </h4>
                }

                <p className="article-dialog-description">{props.article.description}</p>
            </main>
            <footer>
                <Link to={`${props.isUser() ? `/articles/${props.article.slug}` : `/login/`}`}>
                    <span className="read-more">Read more...</span>
                </Link>
            </footer>
        </div>
    );
}

export default ArticleCard;