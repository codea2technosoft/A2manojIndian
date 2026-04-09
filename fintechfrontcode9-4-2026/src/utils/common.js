import { Checkbox, Input, Form } from "antd";
import { BaseSelect } from "components/Elements";

export function generateBusinessPanLabel(businessType) {
	if (['1', '9'].includes(businessType)) return 'Business PAN';
	return 'Company PAN';
}

export function generateBusinessProofLabel(businessType) {
	switch (businessType) {
		case '1':
			return 'GST / MSME / Shops Establishment';
		case '2':
			return 'Partnershipd Deed';
		case '3':
			return 'COI (Certificate of Incorporation)';
		case '4':
			return 'COI (Certificate of Incorporation)';
		case '5':
			return 'COI (Certificate of Incorporation)';
		case '6':
			return 'NGO certificate';
		case '7':
			return 'Trust Certificate';
		case '8':
			return 'Society Certificate';
		default:
			return 'Business Proof Document';
	}
}

export const ORDERTYPE = {
	total_records: 'All Orders',
	unpaid_records: 'Not Paid : Need to be Shipped',
	paid_records: 'Paid : Need to be Shipped',
	fulfillment_processing_records: 'Fulfilment in Process',
};

export function generateFormElement(field) {
	if (field.type === 'hidden') return null;

	let element = <Input />;
	if (field.type === 'textarea') element = <Input.TextArea />;
	else if (field.type === 'select') element = <BaseSelect options={field.options} optionLabel='label' optionValue='value' defaultText="Select one" />
	else if (field.type === 'checkbox') element = <Checkbox.Group options={field.options} />;

	return (
		<Form.Item name={field.name} label={field.label} extra={field.description} rules={[{ required: field.is_required }]}>
			{element}
		</Form.Item>
	)
}

export function generateShipmentTrackingUrl(serviceId, trackingNumber) {
	switch (serviceId) {
		case 7: return `https://shiprocket.co/tracking/${trackingNumber}`;
		case 9: return `https://www.pickrr.com/tracking/#/?tracking_id=${trackingNumber}`;
		default: return null;
	}
}

export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generateSettlementStatusLabel(status) {
	switch (status) {
		case 0:
			return <div className="text-error">N/A</div>;
		case 1:
			return <div className="text-primary">Created</div>;
		case 2:
			return <div className="text-primary">Initiated</div>;
		case 3:
			return <div className="text-warning">Partially Processed</div>;
		case 4:
			return <div className="text-success">Processed</div>;
		case 5:
			return <div className="text-gray">Reversed</div>;
		default:
			return <div className="text-error">N/A</div>;
	}
}

export function generateRandomString(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	let result = '';

	for (let i = 0; i < length; i++) {
		result += characters[Math.floor(Math.random() * characters.length)];
	}

	return result;
}

export function generateServiceName(services, serviceId) {
	const selectedService = services.find(service => Number(service.id) === Number(serviceId));

	if (selectedService) return selectedService.display;

	return null;
}

export function formatCurrency(number) {
	if (isNaN(number)) return '';

	number = Number(number);

	return number.toLocaleString('en-IN', {
		maximumFractionDigits: 2,
		style: 'currency',
		currency: 'INR'
	});
}

export function formatDateTime(datetime) {
	let dateFormat = new Date(datetime)

	// Methods on Date Object will convert from UTC to users timezone
	// Set minutes to current minutes (UTC) + User local time UTC offset

	dateFormat.setMinutes(dateFormat.getMinutes() + dateFormat.getTimezoneOffset())

	// Now we can use methods on the date obj without the timezone conversion

	let dateStr = dateFormat.toLocaleString('en-GB');

	return dateStr;
}