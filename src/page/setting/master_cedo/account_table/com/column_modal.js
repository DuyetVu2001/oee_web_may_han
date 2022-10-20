
import React, { useEffect, useMemo } from "react";
import { get, isEmpty, cloneDeep } from "lodash";
import { Button, Form, Drawer, Checkbox } from "antd";
import styled from "styled-components";


import { RenderForm } from "com/antd_form/render_form";
const ModalForm = ({
    visible,
    jsonFormInput,
    _onClose,
    _onSubmit,
}) => {

    const [dataColumn, setDataColumn] = React.useState(cloneDeep(jsonFormInput));
    useEffect(() => { _handleReset() }, [jsonFormInput])

    const _handleReset = () => {
        setDataColumn(cloneDeep(jsonFormInput))
    }
    const _handleSubmit = () => {
        _onSubmit(dataColumn)
    }

    return (
        <Drawer title={false} placement={'right'} closable={false} onClose={_onClose} visible={visible} width={500}>
            <Header loading={false} _handleReset={_handleReset} _handleSubmit={_handleSubmit} />
            <div>
                {
                    dataColumn.map((c, index) => {
                        return (
                            <div key={index + ''} style={{ padding: '3px 10px' }}>
                                <Checkbox
                                    disabled={!index} checked={c.active}
                                    onChange={() => {
                                        c.active = !c.active;
                                        setDataColumn([...dataColumn]);
                                    }}
                                >{c.title}</Checkbox>
                            </div>
                        )
                    })
                }

            </div>
        </Drawer>
    )
};

const Header = ({ loading, title = "", _handleReset = () => { }, _handleSubmit }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: '500' }}>{title}</span>
            <div>
                <Button
                    loading={loading}
                    onClick={_handleSubmit}
                    type="primary"
                    style={{
                        float: "left",
                        borderRadius: 5, marginLeft: 13, marginTop: 6
                    }}
                > Submit  </Button>
                <Button
                    loading={loading}
                    onClick={_handleReset}
                    // type="primary"
                    style={{
                        float: "left",
                        borderRadius: 5, marginLeft: 13, marginTop: 6
                    }}
                > Reset  </Button>
            </div>
        </div>
    )
}


const StyledForm = styled(Form)`
  .ant-modal-body {
    padding: 0px 24px 24px 24px;
    background: red;
  }

  .ant-form-item {
    margin-bottom: 4px;
  }
`;


export default ModalForm;