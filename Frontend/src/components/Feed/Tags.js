import React from 'react';

class Tags extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3001/api/tags')
        .then(res => res.json())
        .then(tags => this.setState({ tags: tags.tags }));
    }

    render() {
        return (
            <div className="popular-tags flex-start">
                {
                    this.state.tags && this.state.tags.map(tag => <span className="popular-tag">{tag.name}</span>)
                }
            </div>
        );
    }

}

export default Tags;