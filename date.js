//jshint esversion:6

module.exports = getDate;

function getDate() {
  let today = new Date();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
  console.log(today.getDate());
  var dayName = days[today.getDate()-1];

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }

  return today.toLocaleDateString('en-US', options);

}
