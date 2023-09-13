import { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import { observer } from 'mobx-react';
import { InteractionType } from '../Store';
import store from '../Store';

function ModeSelectButton() {
	const [mode, setMode] = useState('');

	useEffect(() => {
		switch (mode) {
			case 'draw_polygon':
				store.currentInteraction = InteractionType.draw_polygon;
				break;
			case 'draw_linestring':
				store.currentInteraction = InteractionType.draw_linestring;
				break;
			case 'draw_point':
				store.currentInteraction = InteractionType.draw_point;
				break;
			case 'modify':
				store.currentInteraction = InteractionType.modify;
				break;
			case 'edit':
				store.currentInteraction = InteractionType.edit;
				break;
			case 'delete':
				store.currentInteraction = InteractionType.delete;
				break;
			default:
				store.currentInteraction = undefined;
				break;
		}
	}, [mode]);

	return (
		<div>
			<Input
				onChange={(e) => setMode(e.target.value)}
				type="select"
				defaultValue="Select Mode (None)"
			>
				<option>Select Mode (None)</option>
				<option value="draw_polygon">Draw (Polygon)</option>
				<option value="draw_linestring">Draw (Line String)</option>
				<option value="draw_point">Draw (Point)</option>
				<option value="modify">Modify</option>
				<option value="edit">Edit</option>
				<option value="delete">Delete</option>
			</Input>
		</div>
	);
}

export default observer(ModeSelectButton);
