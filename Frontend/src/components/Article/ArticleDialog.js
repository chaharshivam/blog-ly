import React from 'react';

function ArticleDialog(props) {
    return (
        <div className="article-dialog">
            <header className="flex-between article-dialog-header">
                <div className="author flex-start">
                    <img className="author-avatar" src="https://static.productionready.io/images/smiley-cyrus.jpg"></img>
                    <div className="article-details flex-start">
                        <a>
                            <span className="author-username">chaharshivam</span>
                        </a>
                        <span className="article-created-on">September 26, 2019</span>
                    </div>
                </div>
                <button className="like-btn">
                    <span className="heart">♥</span>
                    <span className="like-count">0</span>
                </button>
            </header>
            <main>
                <h4 className="article-dialog-heading">Title</h4>
                <p className="article-dialog-description">This is description</p>
            </main>
            <footer>
                <a>
                    <span className="read-more">Read more...</span>
                </a>
            </footer>
        </div>
    );
}

export default ArticleDialog;