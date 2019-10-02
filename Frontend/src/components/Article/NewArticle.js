import React from 'react';
import { withRouter } from 'react-router-dom';

class NewArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            tags: ''
        }
    }

    handleSubmit = e => {
        e.preventDefault();

        fetch(`http://localhost:3001/api/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.authToken
            },
            body: JSON.stringify({ title: this.state.title, description: this.state.description, tags: this.state.tags })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.props.history.push('/');
            })
            .catch(err => console.log(err));
    }

    handleChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    }

    render() {
        return (
            <section className="create-article">
                <div className="wrapper flex-center">
                    <form className="article-form flex-center" onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Title"
                            name="title"
                            onChange={this.handleChange}
                            value={this.state.title}
                        ></input>
                        <textarea
                            className="input-field"
                            placeholder="Content (in markdown)"
                            rows="10"
                            name="description"
                            onChange={this.handleChange}
                            value={this.state.description}
                        ></textarea>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Tags (comma separated)"
                            name="tags"
                            onChange={this.handleChange}
                            value={this.state.tags}
                        ></input>
                        <input type="submit" className="btn btn-secondary" value="Publish" />
                    </form>
                </div>
            </section>
        );
    }
}

export default NewArticle;