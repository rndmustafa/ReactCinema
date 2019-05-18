export function currentDateFormatted() {
  let dateObject = new Date();
  let dd = dateObject.getDate();
  let mm = dateObject.getMonth() + 1;
  let yyyy = dateObject.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  return `${yyyy}-${mm}-${dd}`;
}