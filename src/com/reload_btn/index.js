import { ReloadOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';

const time = [4, 6, 10, 15, 20, 30];
const flexCenterY = { display: 'flex', alignItems: 'center' };

export default function ReloadBtn({
	reloadTime = time[0],
	loading = false,

	handleReloadBtn = () => {},
	handleReloadTime = () => {},
}) {
	return (
		<div style={flexCenterY}>
			<div style={flexCenterY}>
				<p style={{ marginRight: 6, marginBottom: 'unset', fontWeight: 600 }}>
					Time reload:
				</p>

				<Select
					defaultValue={`${reloadTime}s`}
					onChange={handleReloadTime}
					optionLabelProp="label"
					loading={loading}
				>
					{time.map((i) => (
						<Select.Option value={i} label={`${i}s`}>
							{i}s
						</Select.Option>
					))}
				</Select>
			</div>

			<Tooltip title="Reload" placement="bottom">
				<Button
					loading={loading}
					onClick={handleReloadBtn}
					style={{ marginLeft: 16 }}
					shape="round"
					icon={<ReloadOutlined />}
				/>
			</Tooltip>
		</div>
	);
}
