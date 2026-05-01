export default {
    gstin: /^[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    cin: /^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    individualPan: /^[A-Z]{3}[P]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/,
    ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    phone: /^[0-9]+$/,
    stringWithoutSpacesAtStartAndEnd: /^[^\s]+(\s+[^\s]+)*$/,
}