import React from 'react';
import Draw from '../addFood/Draw.jsx';

export class DealFood extends React.Component {
    render() {
        return (
            <div>
                <Draw
                isDelShow={this.props.isDelShow} 
                isDelete={this.props.isDelete}
                pickList={this.props.pickList}
                cancelDel={this.props.cancelDel} 
                dropFood={this.props.dropFood}
                token={this.props.token}
                type={'main'}
                />
            </div>

        )
    }
}
