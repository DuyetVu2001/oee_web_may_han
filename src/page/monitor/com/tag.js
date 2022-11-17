import styled from 'styled-components';

export const TAG_COLORS = ['blue', 'yellow', 'orange'];

export default function Tag({ label = '', value = '', color = 'green' }) {
	return (
		<Box color={color} style={{width:175, height:100}}>
			<div>
				<p className="label">{label}</p>
				<p className="value">{value}</p>
			</div>
		</Box>
	);
}

const Box = styled.div`
	display: inline-flex;
	/* justify-content: center; */
	align-items: center;

	min-width: 100px;
	padding: 12px 18px;
	margin: 6px;
	border-radius: 3px;
	/* text-align: center; */

	background: ${({ color }) => {
		if (color === TAG_COLORS[0])
			return 'linear-gradient(120deg, rgb(61, 112, 255), rgb(112, 188, 255))';
		else if (color === TAG_COLORS[1])
			return 'linear-gradient(120deg, rgb(255, 200, 48), rgb(255, 172, 99))';
		else if (color === TAG_COLORS[2])
			return 'linear-gradient(120deg, rgb(226, 144, 0), rgb(255, 108, 22))';

		return 'linear-gradient(120deg, rgb(66, 154, 67), rgb(111, 183, 87))';
	}};

	& .label {
		margin-left:-17px;
		margin-bottom: 2px;
		font-size: 20px;
		font-weight: 500;
		color: white;
	}

	& .value {
		text-align:center;
		margin-bottom: 0;
		font-size: 36px;
		font-weight: 500;
		color: white;
	}
`;
