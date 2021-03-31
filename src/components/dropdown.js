import React from 'react';

import { Select } from 'antd';

const { Option } = Select;


export default function Dropdown(props) {

    const onTrigger = async (value) => {
        props.parentCallback(value);
    }

    return (
        <>
            <Select defaultValue="6" size='small' style={{width:'120px'}} onChange={onTrigger}>
                <Option value="6">6 pairs</Option>
                <Option value="9">9 pairs</Option>
                <Option value="12">12 pairs</Option>
                <Option value="15">15 pairs</Option>
            </Select>
        </>
    )
}
