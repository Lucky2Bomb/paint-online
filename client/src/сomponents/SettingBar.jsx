import React from 'react';
import "../styles/settingbar.scss";
import toolState from '../store/toolState';

const SettingBar = () => {
    return (
        <div className="settingbar">
            <label className="item" htmlFor="line-width">line width</label>
            <input className="item" type="number" id="line-width" min={1} max={100} defaultValue={1} onChange={e => toolState.setLineWidth(e.target.value)} />
            <label className="item" htmlFor="stroke-color">stroke color</label>
            <input className="item" type="color" id="stroke-color" onChange={e => toolState.setStrokeColor(e.target.value)}/>
        </div>
    )
}

export default SettingBar
