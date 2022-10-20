import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space } from 'antd';
import { get } from 'lodash';


export const RenderForm = ({ jsonFrom, _handleChange = () => { } }) => {
    const { RangePicker } = DatePicker;
    return (
        <div> {
            jsonFrom.map((item, index) => {
                if (item.type === 'number') {
                    return (
                        <Form.Item
                            key={String(index)}
                            name={item.name}
                            label={item.label}
                            rules={item.rules}
                            style={item.hidden ? { display: 'none' } : { margin: '8px 15px' }}
                        >
                            <InputNumber disabled={item.disabled} style={{ width: '100%' }} />
                        </Form.Item>
                    )
                }
                if (item.type === 'password') {
                    return (
                        <Form.Item
                            key={String(index)}
                            name={item.name}
                            label={item.label}
                            rules={item.rules}
                            style={item.hidden ? { display: 'none' } : { margin: '8px 15px' }}
                        >
                            <Input.Password disabled={item.disabled} style={{ width: '100%' }} />
                        </Form.Item>
                    )
                }
                if (item.type === 'select') {
                    return (
                        <Form.Item
                            key={String(index)}
                            name={item.name}
                            label={item.label}
                            rules={item.rules}
                            style={item.hidden ? { display: 'none' } : { margin: '8px 15px' }}
                        >
                            <Select
                                showSearch
                                allowClear
                                disabled={item.disabled}
                                {...(item.isMul ? { mode: 'multiple' } : {})}
                                placeholder={item.placeholder || ''}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={val => _handleChange(item.name, val)}
                            >
                                {
                                    get(item, 'data', [])
                                        .map((item) => {
                                            // console.log('ddd', item)
                                            return <Select.Option key={item.id} value={item.id}>{item.name || item.id}</Select.Option>
                                        })
                                }
                            </Select>
                        </Form.Item>
                    )
                }
                if (item.type == "range_picker") {
                    return <Form.Item name="date" label={null} >
                        <RangePicker style={{marginLeft : '17px'}}/>
                    </Form.Item>
                }
                if (item.type === "date") {
                    return <Form.Item 
                    key={String(index)}
                    name={item.name}
                    label={item.label}
                    rules={item.rules} >
                        <DatePicker disabled={item.disabled} style={{marginLeft : '17px'}}/>
                    </Form.Item>
                }
                return (
                    <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={item.hidden ? { display: 'none' } : { margin: '8px 15px' }}
                    >
                        <Input disabled={item.disabled} />
                    </Form.Item>
                )
            })
        }
        </div>)

}
