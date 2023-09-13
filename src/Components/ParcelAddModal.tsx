import { useEffect, useState } from 'react';
import {
	Button,
	Form,
	FormFeedback,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from 'reactstrap';
import store from '../Store';
import { observer } from 'mobx-react';
import { FeatureData } from '../Classes/FeatureData';
import { WKT } from 'ol/format';
import { addParcel } from '../Utils/Utils';

function ParselAddModal() {
	const [cityInvalid, setCityInvalid] = useState<boolean | undefined>();
	const [districtInvalid, setDistrictInvalid] = useState<
		boolean | undefined
	>();
	const [streetInvalid, setStreetInvalid] = useState<boolean | undefined>();

	function submitHandler(e: React.FormEvent) {
		e.preventDefault();

		let cancel = false;
		if (store.cityValue.length === 0) {
			cancel = true;
			setCityInvalid(true);
		} else {
			setCityInvalid(false);
		}
		if (store.districtValue.length === 0) {
			cancel = true;
			setDistrictInvalid(true);
		} else {
			setDistrictInvalid(false);
		}
		if (store.streetValue.length === 0) {
			cancel = true;
			setStreetInvalid(true);
		} else {
			setStreetInvalid(false);
		}
		if (cancel) return;

		let data = new FeatureData(
			new WKT().writeFeature(store.formFeatures.addForm!),
			store.cityValue,
			store.districtValue,
			store.streetValue,
			false
		);
		addParcel(data).then(() => {
			store.setAddFormFeature(undefined);
		});
	}

	const cancelHandler = (_e: React.MouseEvent) => {
		if (store.formFeatures.addForm) {
			store.source.removeFeature(store.formFeatures.addForm);
		}
		store.setAddFormFeature(undefined);
	};

	useEffect(() => {
		clearForm();
	}, [store.formFeatures.addForm]);

	function clearForm() {
		store.cityValue = '';
		store.districtValue = '';
		store.streetValue = '';
		setCityInvalid(undefined);
		setDistrictInvalid(undefined);
		setStreetInvalid(undefined);
	}

	return (
		<Modal
			id="parselAddModal"
			backdrop="static"
			keyboard={false}
			aria-hidden="true"
			isOpen={store.formFeatures.addForm && true}
		>
			<Form id="parcelAddForm" onSubmit={submitHandler}>
				<ModalHeader>New Parcel</ModalHeader>
				<ModalBody>
					<FormGroup floating>
						<Input
							invalid={cityInvalid}
							id="city"
							placeholder="City"
							value={store.cityValue}
							onChange={(e) => {
								store.cityValue = e.target.value;
							}}
						/>
						<Label for="city">City</Label>
						<FormFeedback valid={false}>
							City cannot be empty
						</FormFeedback>
					</FormGroup>

					<FormGroup floating>
						<Input
							invalid={districtInvalid}
							id="district"
							placeholder="district"
							value={store.districtValue}
							onChange={(e) => {
								store.districtValue = e.target.value;
							}}
						/>
						<Label for="district">District</Label>
						<FormFeedback valid={false}>
							District cannot be empty
						</FormFeedback>
					</FormGroup>

					<FormGroup floating>
						<Input
							invalid={streetInvalid}
							id="street"
							placeholder="street"
							value={store.streetValue}
							onChange={(e) => {
								store.streetValue = e.target.value;
							}}
						/>
						<Label for="street">Street</Label>
						<FormFeedback valid={false}>
							Street cannot be empty
						</FormFeedback>
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<Button color="success">Save Parcel</Button>
					<Button
						type="button"
						color="danger"
						onClick={cancelHandler}
					>
						Cancel
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
}

export default observer(ParselAddModal);
