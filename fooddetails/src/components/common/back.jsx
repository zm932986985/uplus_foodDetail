import React from 'react';
import { PageHeader, Icon } from 'antd';

class JustGo extends React.PureComponent {
    render() {
        return (
            <div className={this.props.className}>
                <PageHeader
                    onBack={()=>window.history.back()}
                    title={this.props.title}
                    subTitle=""
                    backIcon={<Icon type="left" />}
                />
            </div>
        )

    }
}

export default JustGo;