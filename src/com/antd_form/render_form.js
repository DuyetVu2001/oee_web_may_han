import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Space, TimePicker, Checkbox, AutoComplete } from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import { apiClient } from 'helper/request/api_client';


export const RenderForm = ({ jsonFrom, _handleChange = () => { }, dataInit }) => {
    const { RangePicker } = DatePicker;
    return (
        <div> {
            jsonFrom?.map((item, index) => {
                if (item.type === 'number') {
                    return (
                        <Form.Item
                            key={String(index)}
                            name={item.name}
                            label={item.label}
                            rules={item.rules}
                            style={item.hidden ? { display: 'none' } : { margin: '0' }}
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
                            style={item.hidden ? { display: 'none' } : { margin: '0' }}
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
                            style={item.hidden ? { display: 'none' } : { margin: '0' }}
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
                if (item.type == "range_picker_time") {
                    return <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                    >
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                        />
                    </Form.Item>
                }
                if (item.type == "range_picker") {
                    return <Form.Item name="date" label={null} >
                        <RangePicker style={{ marginLeft: '17px' }} />
                    </Form.Item>
                }
                if (item.type === "date") {
                    return <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                    >
                        <DatePicker disabled={item.disabled} style={{ marginLeft: '17px' }} />
                    </Form.Item>
                }
                if (item.type == 'end_time' || item.type == 'start_time') {
                    return <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        disabled={item.disabled}
                    >
                        <TimePicker
                            disabled={item.disabled} defaultValue={item.default} format='HH:mm' />
                    </Form.Item>
                }
                if (item.type == "machines") {
                    return <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                    >
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            defaultValue={[]}
                            optionLabelProp="label"
                        >
                            {item?.data?.map(i => {
                                return (
                                    <Select.Option value={i} label={i}>
                                        <div className="demo-option-label-item">
                                            {i}
                                        </div>
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Form.Item>
                }
                if (item.type == "datesTime") {
                    return <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                    >
                        <Checkbox.Group options={item.data} />
                    </Form.Item>
                }
                if (item.type == "checkbox") {
                    return <Form.Item
                        key={String(index)}
                        name={item.name}
                        // label={item.label}
                        rules={item.rules}
                        valuePropName="checked"
                    >
                        <Checkbox>Active</Checkbox>
                    </Form.Item>
                }
                if (item.type === 'TextArea') {

                    return (
                        <Form.Item
                            key={String(index)}
                            name={item.name}
                            label={item.label}
                            rules={item.rules}
                            style={item.hidden ? { display: 'none' } : { margin: '0' }}
                        >
                            <Input.TextArea rows={4} disabled={item.disabled} />
                        </Form.Item>
                    )
                }
                return (
                    <Form.Item
                        key={String(index)}
                        name={item.name}
                        label={item.label}
                        rules={item.rules}
                        style={item.hidden ? { display: 'none' } : { margin: '0' }}
                    >
                        <Input disabled={item.disabled} />
                    </Form.Item>
                )
            })
        }
        </div>)

}
