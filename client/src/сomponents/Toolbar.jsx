import React from 'react';
import "../styles/toolbar.scss";
import toolState from '../store/toolState';
import Brush from './../tools/Brush';
import canvasState from '../store/canvasState';
import Rect from './../tools/Rect';
import Circle from './../tools/Circle';
import Line from './../tools/Line';
import Eraser from './../tools/Eraser';

const Toolbar = () => {

    const changeColor = (e) => {
        toolState.setStrokeColor(e.target.value);
        toolState.setFillColor(e.target.value);
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL();
        console.log(dataUrl);
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = canvasState.sessionId + ".jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <div className="toolbar">
            <div className="toolbar__left-side">
                <button className="toolbar__button brush" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
                <button className="toolbar__button rect" onClick={() => toolState.setTool(new Rect(canvasState.canvas))} />
                <button className="toolbar__button circle" onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
                <button className="toolbar__button eraser" onClick={() => toolState.setTool(new Eraser(canvasState.canvas))} />
                <button className="toolbar__button line" onClick={() => toolState.setTool(new Line(canvasState.canvas))} />
                {/* <button className="toolbar__button colors" /> */}
                <input onChange={e => changeColor(e)} type="color" className="toolbar__button color" />
            </div>
            <div className="toolbar__right-side">
                <button className="toolbar__button undo" onClick={() => canvasState.undo()}/>
                <button className="toolbar__button redo" onClick={() => canvasState.redo()}/>
                <button className="toolbar__button save" onClick={() => download()} />
            </div>
        </div>
    )
}

export default Toolbar
