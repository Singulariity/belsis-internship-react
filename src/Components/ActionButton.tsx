import { observer } from 'mobx-react';
import { FeatureData } from '../Classes/FeatureData';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	IconDefinition,
	faPaperPlane,
	faPencil,
	faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import store from '../Store';
import { easeOut } from 'ol/easing';
import WKT from 'ol/format/WKT';

interface ActionButtonProps {
	type: 'edit' | 'delete' | 'go';
	data: FeatureData;
}

function ActionButton({ type, data }: ActionButtonProps) {
	let color;
	let icon: IconDefinition;
	let text: string;
	var action: () => void;
	switch (type) {
		case 'edit':
			color = 'warning';
			icon = faPencil;
			text = 'Edit';
			action = function () {
				store.setEditFormFeature(data);
			};
			break;
		case 'delete':
			color = 'danger';
			icon = faTrashCan;
			text = 'Delete';
			action = function () {
				store.setDeleteFormFeature(data);
			};
			break;
		case 'go':
			color = 'success';
			icon = faPaperPlane;
			text = 'Go';
			action = function () {
				let wkt = data.getWKT();
				store.map?.getView().fit(new WKT().readGeometry(wkt) as any, {
					padding: [100, 100, 100, 100],
					minResolution: 50,
					easing: easeOut,
					duration: 1250,
				});
			};
			break;
	}

	return (
		<Button size="sm" color={color} onClick={action}>
			<FontAwesomeIcon icon={icon} /> {text}
		</Button>
	);
}

export default observer(ActionButton);
