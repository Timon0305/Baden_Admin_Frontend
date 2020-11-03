import Config from '../config/';

export const GENDER = [
  'male',
  'female',
  'unisex',
];

export const STATUS = [
  'ACTIVE',
  'DELETED',
];

export const LANG = [
  'english',
  'spanish',
  'chinese',
];

export const BLOOD_TYPE = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
];

export const EMPTY_USER = {
  avatarUrl: Config.BASE_URL + "/images/avatar/default.png",
  email: "",
  fullName: "",
  phoneNumber: "",
  status: "ACTIVE",
};

export const EMPTY_VEHICLE = {
  carUrl : Config.BASE_URL + "/images/cars/default_cars.png",
  fullName: ''
}

export const DOCTOR_SPECIALITY = {
  'gynecologist': 'Gynecologist',
  'skin_specialist': 'Skin Specialist',
  'child_specialist': 'Child Specialist',
  'orthopedic_surgeon': 'Orthopedic Surgeon',
  'ent_specialist': 'ENT Specialist',
  'diagnostics': 'Diagnostics',
  'diabetes_specialist': 'Diabetes Specialist',
  'eye_specialist': 'Eye Specialist'
};
