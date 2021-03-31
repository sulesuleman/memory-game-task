import React from 'react'

import "./sidebar.scss";

import Dropdown from '../../components/dropdown';

import { Button } from 'antd';

export default function Sidebar({ restart, parentCallback, count, total, tries }) {

    return (

        <div className="stats-container">
            <div className="score-container">
                <p className="title">Score</p>
                <div className="score">
                    <p className="obtain">{count}</p><p className="slash">/</p><p className="total">{total}</p>
                </div>
                <p className="try">Tries: {tries}</p>
                <hr className="divider"></hr>
            </div>
            <div className="option-container">
                <p className="opt-title">Options</p>
                <div className="select-pair">
                    <div style={{flex:0.2}}>
                        <p className="size"> Size</p>
                    </div>
                    <div style={{flex:0.8}}>
                        <Dropdown parentCallback={parentCallback} />
                    </div>
                </div>
                <Button className="button" onClick={restart}>Restart</Button>
            </div>
        </div>
    )
}