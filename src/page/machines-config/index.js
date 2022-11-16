import InApp from 'com/in_app_layout';
import MachineTable from './machines';

export default function ConfigPage() {
	return (
		<InApp>
			<div style={{ marginTop: 12 }}>
				<MachineTable />
			</div>
		</InApp>
	);
}
