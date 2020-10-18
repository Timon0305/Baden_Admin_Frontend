import Config from '../../config/';
const key = 'credentials';

const tag = 'Service::Credentials';
function Credentials(sessionToken, userDetails, created, expires = 3600 * 1000) {
  this.sessionToken = sessionToken;
  this.userDetails = userDetails;
  this.created = new Date().getTime();
  this.expires = expires;
}

// Read from NetworkResponse data
Credentials.fromResponse = function ({sessionToken, userDetails}) {
  userDetails.avatarUrl = Config.BASE_URL + userDetails.avatarUrl;
  return new Credentials(sessionToken, userDetails, new Date().getTime(), 3600 * 1000);
};

// Read write from State object.
Credentials.fromState = function ({sessionToken, userDetails, created, expires}) {
  return new Credentials(sessionToken, userDetails, created, expires);
};

Credentials.prototype.toState = function () {
  let result = {
    sessionToken: this.sessionToken,
    userDetails: this.userDetails,
    isAuthenticated: this.isValid() && this.isTokenValid(),
    created: this.created,
    expires: this.expires,
  };

  Object.keys(result).forEach(key => {
    if (result[key] === undefined) {
      delete result[key];
    }
  });

  return result;
};

// Read write from Local Storage Object.
Credentials.fromStorage = function () {
  try {
    const base64 = localStorage.getItem(key);
    const json = window.atob(base64 || "");

    const {sessionToken, userDetails, created, expires} = JSON.parse(json);
    return new Credentials(sessionToken, userDetails, created, expires);
  } catch (e) {
  }
  return new Credentials();
};

Credentials.prototype.save2Storage = function () {
  try {
    const json = JSON.stringify(this.toState());
    localStorage.setItem(key, window.btoa(json));
  } catch (e) {
  }
};

Credentials.clearStorage = function () {
  localStorage.removeItem(key);
};

Credentials.prototype.isValid = function () {
  return (this.sessionToken && this.created && !isNaN(this.created));
};

Credentials.prototype.isTokenValid = function () {
  const now = new Date().getTime();
  // console.log(tag, 'isTokenValid', now, this.created, this.expires);
  return this.isValid() && now < (this.created + this.expires - 3000);    //Delta is 3 seconds
};


export default Credentials;
