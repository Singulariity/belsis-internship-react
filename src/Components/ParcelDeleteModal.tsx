import {
	Alert,
	Button,
	Form,
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
import { deleteParcel } from '../Utils/Utils';

function ParcelDeleteModal() {
	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault();
		if (!store.formFeatures.deleteForm) return;

		deleteParcel(store.formFeatures.deleteForm).then(() => {
			store.setDeleteFormFeature(undefined);
		});
	};

	const cancelHandler = (_e: React.MouseEvent) => {
		store.setDeleteFormFeature(undefined);
	};

	return (
		<Modal
			id="parselDeleteModal"
			backdrop="static"
			keyboard={false}
			aria-hidden="true"
			isOpen={store.formFeatures.deleteForm && true}
		>
			<Form id="parcelDeleteForm" onSubmit={submitHandler}>
				<ModalHeader>Are you sure?</ModalHeader>
				<ModalBody>
					<FormGroup floating>
						<Input
							id="city"
							placeholder="City"
							value={
								store.formFeatures.deleteForm
									? store.formFeatures.deleteForm.getCity()
									: ''
							}
							disabled
						/>

						<Label for="city">City</Label>
					</FormGroup>
					<FormGroup floating>
						<Input
							id="district"
							placeholder="district"
							value={
								store.formFeatures.deleteForm
									? store.formFeatures.deleteForm.getDistrict()
									: ''
							}
							disabled
						/>
						<Label for="district">District</Label>
					</FormGroup>
					<FormGroup floating>
						<Input
							id="street"
							placeholder="street"
							value={
								store.formFeatures.deleteForm
									? store.formFeatures.deleteForm.getStreet()
									: ''
							}
							disabled
						/>
						<Label for="street">Street</Label>
					</FormGroup>
					<Alert color="danger">
						You are about to delete this parcel!
					</Alert>
				</ModalBody>
				<ModalFooter>
					<Button color="danger">Yes, Delete</Button>
					<Button
						type="button"
						color="secondary"
						onClick={cancelHandler}
					>
						Cancel
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
}

export default observer(ParcelDeleteModal);
