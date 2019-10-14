/**
 *
 * @param method request method get or post
 * @param url requested url
 * @param data data to be sent
 * @param success a function defines what to do after successfully sending out data
 * return undefined
 */
function ajax(options) {
  //assign value to method, "get" by default
  var method = options.method || 'get';
  //send out request
  var xhr = null;
  try {
    xhr = new XMLHttpRequest();
  } catch (e) {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if (method.toLowerCase() === 'get') {
    xhr.open('get', options.url + "?" + options.data, true);
    xhr.send();
  } else if (method.toLowerCase() === 'post') {

    xhr.open('post', options.url, true);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(options.data);
  } else {
    console.log("Invalid request method!");
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var arr = JSON.parse(xhr.responseText);

      options.success && options.success(arr);
    }

  }
}
