import React from 'react';

class CommentCard extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        fetch(`http://localhost:3001/api/articles/${this.props.slug}/comments/${this.props.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.authToken}`
            }
        })
        .then(res => res.json())
        .then(data => this.props.updateComment());
    }

    render() {
        return (
            <div className="comment-card">
                <p className="comment-description">{this.props.content}</p>
                <div className="comment-author flex-between">
                    <div>
                        <img className="author-avatar" src="https://static.productionready.io/images/smiley-cyrus.jpg"/>
                        <span className="comment-author-username">{this.props.author}</span>
                        <span className="comment-date">{this.props.createdAt}</span>
                    </div>
                    {
                        this.props.isUser().username == this.props.author ? <button className="comment-delete" onClick={this.handleClick}>❌</button> : ''
                    }
                </div>
            </div>
        );
    }
}

export default CommentCard;