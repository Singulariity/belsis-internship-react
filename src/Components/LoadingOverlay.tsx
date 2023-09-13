import '../css/loadingOverlay.css';
import { observer } from 'mobx-react';

interface LoadingOverlayProps {
	active: boolean;
}

function LoadingOverlay({ active }: LoadingOverlayProps) {
	const name = 'loading' + (!active ? ' hidden' : '');

	return (
		<div className={name}>
			<div className="uil-ring-css">
				<div></div>
			</div>
		</div>
	);
}

export default observer(LoadingOverlay);
