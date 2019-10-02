import React from 'react';
import ArticleCard from './ArticleCard';

class ArticleDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (  
            this.props.articles && this.props.articles.map(article => {
                return (<ArticleCard
                    isUser={this.props.isUser}
                    article={article}
                />)
            })      
        );
    }
}

export default ArticleDialog;