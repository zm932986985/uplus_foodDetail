import React from 'react';
import { Redirect } from 'react-router-dom';
import { PageHeader } from 'antd';
class JustGo extends React.PureComponent {
    constructor(){
        super();
        this.state = {
            isGo:false
        }
        this.skipPage = this.skipPage.bind(this);
    }
    skipPage(){
        console.log(1111);
        this.setState({
            isGo:!this.state.isGo
        });
    }
    render() {
        if (this.state.isGo) {
            return (
                <Redirect push to={this.props.route} />
            )
        }
        return (
            <div>
            <PageHeader
                onBack={this.skipPage}
                title={this.props.title}
                subTitle=""
            />
            </div>
        )

    }
}

export default JustGo;