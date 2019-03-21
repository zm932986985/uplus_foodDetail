import React from 'react';
import Draw from '../addFood/Draw';

export class DealFood extends React.Component {
    render() {
        return (
            <div>
                <Draw 
                isDelete={this.props.isDelete}
                pickList={this.props.pickList} 
                dropFood={this.props.dropFood}
                token={this.props.token}
                type={'main'}
                />
            </div>

        )
    }
}
