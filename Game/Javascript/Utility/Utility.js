export class Utility {
  /**
   * Executes an AJAX get request.
   */
  static RunAJAXGet(url, data, successCallback, failCallback) {

    let encodedString = '';
    Object.keys(data).forEach(key => {
      if (encodedString.length > 0) {
        encodedString += "&"
      }
      encodedString += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    });

    let xhttp = new XMLHttpRequest();
    if (encodedString.length > 0) {
      xhttp.open('GET', url + '?' + encodedString, true);
    } else {
      xhttp.open('GET', url, true);
    }
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === XMLHttpRequest.DONE) {
        if (xhttp.status === 200) {
          successCallback(xhttp.responseText);
        } else {
          if (failCallback !== null) failCallback(url, 'Bad Status: ' + xhttp.status, null);
        }
      }
    };

    xhttp.send();
  }

  /**
   * Executes an AJAX post request.
   */
  static RunAJAXPost(url, data, successCallback, failCallback) {
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === XMLHttpRequest.DONE) {
        if (xhttp.status === 200) {
          successCallback(xhttp.responseText);
        } else {
          if (failCallback !== null) failCallback(url, 'Bad Status: ' + xhttp.status, null);
        }
      }
    };
    let encodedString = '';
    Object.keys(data).forEach(key => {
      if (encodedString.length > 0) {
        encodedString += "&";
      }
      encodedString += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    });
    xhttp.send(encodedString);
  }

  /**
   * Converts text to JSON.
   */
  static ConvertTextToJSON(text) {
    return JSON.parse(text);
  }

  /**
   * Removes all elements from the HTML element.
   */
  static ClearElements(div){
    while(div.firstChild){
      div.removeChild(div.firstChild);
    }
  }

  /**
   * Runs a function on the next DOM page redraw.
   */
  static RunFunctionOnDomRefresh(func) {
    requestAnimationFrame(func);
  }

  /**
   * Sets page focus to an element on the screen.
   */
  static FocusElement(invalidField) {
    if (invalidField !== null) {
      invalidField.focus();
    }
  }

  /**
   * This function removes any styles manually applied to an element and only keeps the
   * styles provided through the CSS classes.
   */
  static RemoveAllInlineStyles(element) {
    element.setAttribute('style', '');
  }

  /**
   * Returns a variable that is stored in the URL.
   */
  static GetURLVariableByName(name, url = window.location.href) {
    name = Utility.EscapeRegExp(name);
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return null;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
   * Rounds a number to a decimal value.
   */
  static RoundNumberToDecimal(value, exp) {
    if (typeof exp === 'undefined' || +exp === 0)
      return Math.round(value);

    value = +value;
    exp = +exp;

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
      return NaN;

    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
  }

  /**
   * Rounds a number to a decimal and returns it in string format.
   */
  static RoundNumberToDecimalAsString(value, exp) {
    return (Utility.RoundNumberToDecimal(value, exp)).toFixed(exp);
  }

  /**
   * Formats a number to a local string to the local client format for numbers.
   * @param num
   * @returns {string}
   * @constructor
   */
  static FormatNumber(num) {
    return num.toLocaleString();
  }

  /**
   * Escapes a string using regex.
   */
  static EscapeRegExp(str) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  /**
   * Returns true or false if a string exists in another string.
   */
  static IsStringInString(str, find, caseSensitive = true) {
    if (str == null || find == null) return false;
    let sensitivity = caseSensitive?'g':'gi';
    let re = new RegExp(Utility.EscapeRegExp(find), sensitivity);
    return !(str.search(re) === -1);
  }

  /**
   * Replaces all instances of a string in a string.
   */
  static ReplaceAll(str, find, replace) {
    return str.replace(new RegExp(Utility.EscapeRegExp(find), 'g'), replace);
  }

  /**
   * Strips slashes from a string.
   */
  static StripSlashes(str) {
    return str.replace(/\\(.)/mg, "$1");
  }

  /**
   * Clears all client side cookies.
   */
  static ClearCookies() {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  /**
   * Calls a function after a delay in seconds.
   */
  static CallFunctionAfterDelay(seconds, callback) {
    setTimeout(callback, seconds * 1000);
  }

  /**
   * Creates a function with an owner target for callbacks.
   */
  static CreateFunction(owner, func) {
    return (...allOthers) => { return func.apply(owner, allOthers) };
  }

  /**
   * Returns a random double between min and max, inclusive.
   */
  static GetRandomDouble(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Returns a random int between min and max, inclusive.
   */
  static GetRandomInt(min, max) {
    return Math.round(Utility.GetRandomDouble(min, max));
  }

  /**
   * Returns a random object from the array.
   */
  static GetRandomObjectInArray(array) {
    let number = Utility.GetRandomInt(0, array.length - 1);
    return array[number];
  }

  /**
   * Returns an array with unique elements.
   */
  static GetUniqueArray(arr) {
    return arr.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
  };

  /**
   * Returns true if the client browser is IE or Edge.
   */
  static detectIE() {
    let ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    let msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    let trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      let rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    let edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
  }

  /**
   * Downloads a file from the given URL and returns it as a binary blob to the callback.
   */
  static  ConvertFileToDataURL(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
      let reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  /**
   * Converts a base64 string to a binary blob.
   */
  static Base64StringToBinaryBlock(b64Data) {
    let sliceSize = 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let index = 0; index < slice.length; index++) {
        byteNumbers[index] = slice.charCodeAt(index);
      }

      let byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays);
  };

  /**
   * Checks if running in electron
   * @returns bool
   * @constructor
   */
  static IsRunningInElectron() {
    return (typeof (window) !== 'undefined' && 'process' in window && 'type' in window['process']);
  };
}