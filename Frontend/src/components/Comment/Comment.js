import React from 'react';
import CommentCard from './CommentCard';
import { withRouter } from 'react-router-dom';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            comments: null
        }
    }
    fetchComment = () => {
        fetch(`http://localhost:3001/api/${this.props.match.url}/comments`)
        .then(res => res.json())
        .then(comments => this.setState({ comments: comments.comments }))
    }
    componentDidMount() {
        this.fetchComment();
    }

    handleChange = ({ target: { value } }) => {
        this.setState({ content: value });
    }

    handleSubmit = e => {
        e.preventDefault();
        fetch(`http://localhost:3001/api${this.props.match.url}/comments`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.authToken
            },
            body: JSON.stringify({ content: this.state.content })
        })
        .then(res => res.json())
        .then(data => {
            this.fetchComment();
            this.setState({ content: '' });
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <section className="comments-container">
                <div className="wrapper flex-center">
                    <form className="add-comment flex-center" onSubmit={this.handleSubmit}>
                        <textarea
                            onChange={this.handleChange}
                            value={this.state.content}
                            className="comment-box" cols="40"
                            rows="5"
                            placeholder="Write a comment..."
                        >
                        </textarea>
                        <input className="btn btn-secondary" type="submit" value="Post Comment"/>
                    </form>
                </div>
                <div className="wrapper flex-center comment-card-container">
                    {
                        this.state.comments && this.state.comments.map(comment => (
                            <CommentCard 
                                content={comment.content}
                                author={comment.author.username}
                                createdAt={new Date(comment.createdAt).toDateString()}
                                id={comment._id}
                                slug={this.props.match.params.slug}
                                updateComment={this.fetchComment}
                                isUser={this.props.isUser}
                            />
                        ))
                    }
                </div>
            </section>
        );
    }
}

export default withRouter(Comment);