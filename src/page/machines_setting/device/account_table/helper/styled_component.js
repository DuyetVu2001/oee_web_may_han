import { Card, Table } from 'antd';
import styled from "styled-components";

export const CardCustom = styled(Card)`
    margin: 0px;
    padding: 0px;

    border: none;
    & .ant-card-body {
        padding: 0px 20px;
    }
    & .ant-card-head-title {
        padding: 1px 0px;
    }
    & .ant-card-extra {
        padding: 10px 0px;
    }
`;
export const TableCustom = styled(Table)`
    .ant-table-cell {
        padding: 5px 10px;
    }
    .ant-table-tbody > tr:hover td{
        background: #ddd;
    }
`;
