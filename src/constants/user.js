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
  bloodType: "",
  email: "",
  fullName: "",
  gender: "",
  language: "",
  phoneNumber: "",
  status: "ACTIVE",
  password: "123456",
  speciality: '',
  street: '',
  city: '',
  country: ''
};

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
