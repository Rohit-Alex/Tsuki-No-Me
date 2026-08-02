const API = process.env.REACT_APP_API_URL;
const SECRET = process.env.REACT_APP_SECRET_KEY;
if (process.env.NODE_ENV !== 'production') {
  console.log('dev only warning');
}
console.log(API, SECRET);
