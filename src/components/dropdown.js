import React from 'react';

import { Select } from 'antd';

const { Option } = Select;


export default function Dropdown(props) {

    // const [pair, setpair] = useState(6) 

    const onTrigger = async (value) => {
        console.log("dropdown", value)
        props.parentCallback(value);
    }

    return (
        <>
            <Select defaultValue="6" style={{ width: 120 }} onChange={onTrigger}>
                <Option value="6">6 pairs</Option>
                <Option value="8">8 pairs</Option>
                <Option value="10">10 pairs</Option>
                <Option value="12">12 pairs</Option>
            </Select>
        </>
    )
}
