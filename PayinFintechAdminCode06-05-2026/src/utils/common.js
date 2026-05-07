import { Checkbox, Input, Form } from "antd";
import BaseSelect from "components/Elements/BaseSelect";

export function generateFormElement(field) {
	// if (field.type === 'hidden') return null;
	
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

export function generateServiceName(services, serviceId) {
	const selectedService = services.find(service => Number(service.id) === Number(serviceId));

	if (selectedService) return selectedService.display;

	return null;
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


export const ORDERTYPE = {
	total_records: 'All Orders',
	unpaid_records: 'Not Paid : Need to be Shipped',
	paid_records: 'Paid : Need to be Shipped',
	fulfillment_processing_records: 'Fulfilment in Process',
};