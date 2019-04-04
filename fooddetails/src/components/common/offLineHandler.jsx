import React from 'react';
const OffLine = () => {
    return (
        <div className="OffLine">
        <img src={require('../../assets/images/no_internet.png')} alt=""/>
            <span>请检查网络连接</span>

        </div>
    )
}
export default OffLine;