import React from 'react';
import ArticleCard from './ArticleCard';

class ArticleDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/api/articles')
        .then(res => res.json())
        .then(data => this.setState({ articles: data.articles }));
    }

    render() {
        return (  
            this.state.articles && this.state.articles.map(article => {
                return (<ArticleCard 
                    author={article.author.username}
                    createdAt={new Date(article.createdAt).toDateString()}
                    likes={article.likes}
                    title={article.title}
                    description={article.description}
                />)
            })      
        );
    }
}

export default ArticleDialog;