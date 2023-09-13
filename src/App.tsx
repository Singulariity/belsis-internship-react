import LoadingOverlay from './Components/LoadingOverlay';
import ParcelAddModal from './Components/ParcelAddModal';
import MapWrapper from './Components/MapWrapper';
import ParcelDeleteModal from './Components/ParcelDeleteModal';
import FeatureList from './Components/FeatureList';
import ParcelEditModal from './Components/ParcelEditModal';
import store from './Store';
import { observer } from 'mobx-react';

function App() {
	return (
		<>
			<MapWrapper />
			<ParcelAddModal />
			<ParcelEditModal />
			<ParcelDeleteModal />
			<FeatureList />

			<LoadingOverlay active={store.isLoadingOverlay} />
		</>
	);
}

export default observer(App);
