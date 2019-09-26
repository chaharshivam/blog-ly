import React from 'react';
import ArticleDialog from '../Article/ArticleDialog';

function Feed(props) {
    return (
        <main className="feed-container">
            <div className="wrapper flex-between">
                <aside className="feed">
                    <header className="feed-header">
                        <a className="feed-btn">Global Feed</a>
                    </header>
                    <main>
                        <ArticleDialog />
                        <ArticleDialog />
                        <ArticleDialog />
                        <ArticleDialog />
                        <ArticleDialog />
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
                <aside className="popular-tags-container">
                    <h5>Popular tags</h5>
                    <div className="popular-tags flex-start">
                        <span className="popular-tag">nodejs</span>
                        <span className="popular-tag">react</span>
                        <span className="popular-tag">javascript</span>
                        <span className="popular-tag">c++</span>
                        <span className="popular-tag">java</span>
                        <span className="popular-tag">api</span>
                    </div>
                </aside>
            </div>
        </main>
    );
}

export default Feed;