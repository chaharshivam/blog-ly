import React from 'react';

function ArticleCard(props) {
    return (
        <div className="article-dialog">
            <header className="flex-between article-dialog-header">
                <div className="author flex-start">
                    <img className="author-avatar" src="https://static.productionready.io/images/smiley-cyrus.jpg"></img>
                    <div className="article-details flex-start">
                        <a>
                            <span className="author-username">{props.author}</span>
                        </a>
                        <span className="article-created-on">{props.createdAt}</span>
                    </div>
                </div>
                <button className="like-btn">
                    <span className="heart">♥</span>
                    <span className="like-count">{props.likes}</span>
                </button>
            </header>
            <main>
                <h4 className="article-dialog-heading">{props.title}</h4>
                <p className="article-dialog-description">{props.description}</p>
            </main>
            <footer>
                <a>
                    <span className="read-more">Read more...</span>
                </a>
            </footer>
        </div>
    );
}

export default ArticleCard;