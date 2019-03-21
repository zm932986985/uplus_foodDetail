//食材信息页面
import { List } from 'antd';//插件库
import React from 'react';
import Back from '../common/back'
class Detail extends React.Component {
    render() {
        console.log(this.props.location.query)
        return (
            <div className="Detail">
                <Back route="/" title={this.props.location.query.name} />
                <div className="Detail_pic">
                    <img
                        src={this.props.location.query.picUrl}
                        alt="暂无图片" />
                </div>
                <div>

                    <List
                        bordered
                        dataSource={this.props.location.query.data}
                        renderItem={item => (
                            <List.Item>
                                <div>{item.name}</div>
                                <div>{item.content}</div>
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        )
    }
}

export default Detail;