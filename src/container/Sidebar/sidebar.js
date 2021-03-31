import React from 'react'

import "./sidebar.scss";

import Dropdown from '../../components/dropdown'; 

import { Button } from 'antd';

export default function Sidebar({ Restart, parentCallback }) {
     
    return (

        <div className="stats-container">
            <div className="score-container">
                <p className="title">Score</p>
                <div className="score">
                    <p className="obtain">2</p> <p className="slash">/</p> <p className="total">10</p>
                </div>
                <p className="try">Tries: 5</p>
                <hr className="divider"></hr>
            </div>
            <div className="option-container">
                <p className="opt-title">Options</p>
                <div className="select-pair">
                    <p className="size"> Size </p> {' '} <Dropdown parentCallback={parentCallback}/>
                    <Button onClick={Restart}>Restart</Button>
                </div>
            </div>
        </div>
    )
}