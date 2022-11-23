import styled from 'styled-components';

export const TAG_COLORS = ['blue', 'yellow', 'orange','pink'];

export default function Tag({ label = '', value = '', color = 'green', unit = '' }) {
	return (
		<Box 
			color={color} 
			grid = {{
				gutter:16,
				xs:1,
				sm:2,
				md:3,
				lg:3,
				xl:3,
				xxl:3
			}}
		>
			<div 
				style={{width:550, height:100, marginLeft:20}}
			>
				<p className="label">{label}</p>
				<span className="value">{value}
					<span className="unit">({unit})</span>
				</span>
				
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
		else if (color ===TAG_COLORS[3])
			return 'linear-gradient(120deg, rgb(194, 68, 219), rgb(194, 68, 219))';
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
		margin-left:380px;
		margin-bottom: 0;
		font-size: 36px;
		font-weight: 500;
		color: white;
	}
	& .unit {
		margin-left:15px;
		font-size: 18px;
		font-weight: 500;
		color: white;
	}
`;
