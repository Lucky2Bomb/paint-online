import React, { useEffect, useRef, useState } from 'react';
import "../styles/canvas.scss";
import "../styles/modal-window.scss";
import canvasState from '../store/canvasState';
import { observer } from 'mobx-react-lite';
import toolState from '../store/toolState';
import Brush from './../tools/Brush';
import { useParams } from "react-router-dom";
import Circle from './../tools/Circle';
import axios from "axios";

const Canvas = observer(() => {

    const canvasRef = useRef()
    const usernameRef = useRef();
    const [modalWindow, setModalWindow] = useState(true);
    const params = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
        let ctx = canvasRef.current.getContext("2d");
        axios.get(`http://localhost:3001/image?id=${params.id}`)
            .then(response => {
                const img = new Image();
                img.src = response.data;
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            });
    }, []);

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`ws://localhost:3001/`);
            canvasState.setSocket(socket);
            canvasState.setSessionId(params.id);
            toolState.setTool(new Brush(canvasRef.current, socket, params.id));
            socket.onopen = () => {
                console.log("connection success");
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: "connection"
                }));
            }

            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data);
                switch (msg.method) {
                    case "connection":
                        console.log(`user ${msg.username} connected`)
                        break;

                    case "draw":
                        drawHandler(msg);
                        break;
                    default: break;
                }
            }
        }
    }, [canvasState.username]);

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext("2d");
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y);
                break;

            case "finish":
                ctx.beginPath();
                break;

            case "circle":
                Circle.staticDraw(ctx, figure.x1, figure.y1, figure.x2, figure.y2, figure.color);
                break;

            default:
                break;
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
        axios.post(`http://localhost:3001/image?id=${params.id}`, { img: canvasRef.current.toDataURL() }).then(response => console.log(response.data));
    }

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value);
        setModalWindow(false);
    }


    return (
        <div className="canvas">
            <div className="modal-window" style={{ display: modalWindow ? "flex" : "none" }}>
                <div className="modal-window__form">
                    <label className="modal-window__item" htmlFor="name">Enter your Name:</label>
                    <input className="modal-window__item" type="text" id="name" ref={usernameRef} />
                    <button className="modal-window__item" onClick={() => connectHandler()}>sign in</button>
                </div>
            </div>
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400} />
        </div>
    )
});

export default Canvas;