import Layer from 'ol/layer/Layer';
import LayerRenderer from 'ol/renderer/Layer';
import Source from 'ol/source/Source';
import { FormGroup, Input, Label } from 'reactstrap';
import { useState } from 'react';
import { observer } from 'mobx-react';

interface LayerListProps {
	layer: Layer<Source, LayerRenderer<any>>;
	text: string;
}

function LayerList({ layer, text }: LayerListProps) {
	const [state, setState] = useState(layer.isVisible());
	const [rangeState, setRangeState] = useState(100);

	return (
		<div style={{ paddingBottom: '10px' }}>
			<FormGroup switch>
				<Label check>{text}</Label>
				<Input
					type="switch"
					checked={state}
					onChange={() => {
						setState(!state);
						layer.setVisible(!state);
					}}
				/>
			</FormGroup>
			<Input
				type="range"
				value={rangeState}
				onChange={(val) => {
					let num = parseInt(val.currentTarget.value);
					setRangeState(num);
					layer.setOpacity(Math.max(num / 100, 0.3));
				}}
			/>
		</div>
	);
}

export default observer(LayerList);
