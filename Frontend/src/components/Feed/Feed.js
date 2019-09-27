import React from 'react';
import ArticleDialog from '../Article/ArticleDialog';
import Tags from './Tags';

class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/api/tags')
        .then(res => res.json())
        .then(tags => this.setState({ tags: tags.tags }));
    }

    render() {
        return (
            <main className="feed-container">
                <div className="wrapper flex-between">
                    <aside className="feed">
                        <header className="feed-header">
                            <a className="feed-btn">Global Feed</a>
                        </header>
                        <main>
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
                        <Tags />
                    </aside>
                </div>
            </main>
        );
    }
}

export default Feed;