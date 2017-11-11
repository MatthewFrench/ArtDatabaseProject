import {Utility} from "./Utility.js";

/**
 * Handles interface logic. Such as creation and displaying certain elements.
 */
let MissedErrorDiv = null;
export class Interface {
  static InitializeMissedErrorTracker() {
    MissedErrorDiv = Interface.Create({type: 'div', className:"MissedErrorDiv"});
    window.onerror = (errorMsg, url, lineNumber) => {
      Interface.Create({type: 'div', elements: [
        {type: 'span', text: errorMsg},
        {type: 'p'},
        {type: 'span', text: 'Error URL: ' + url},
        {type: 'p'},
        {type: 'span', text: 'Error Line Number: ' + lineNumber},
        {type: 'p'}
      ], appendTo: MissedErrorDiv});

      document.body.appendChild(MissedErrorDiv);
    };
  };

  /**
   * Recalculates an element so it can be animated by CSS transitions.
   */
  static ReflowElement(element) {
    element.getBoundingClientRect();
  }

  /**
   * Allows nested creation of elements to manipulate the dom in a simple but powerful manner. All parameters are optional.
   */
  static Create({type = 'div', className = null, inputType = null, text = null, html = null, opacity = null,
                  appendTo = null, src = null, id = null, value = null, name = null, onClick = null, onMouseMove = null, onMouseDown = null,
                  onMouseUp = null, onMouseOver = null, onMouseOut = null, elements = [], placeholder = null, href = null,
                  target = null, onKeyUp = null, onKeyDown = null, colspan = null, onChange = null, onInput = null,
                  attributes = null, style = null, onFocus = null, outFocus = null, onBlur = null, width = null, height = null
                }) {
    //type : Element type to create
    //class : Class name of element
    //text : Inner text
    //html : Set inner html
    //appendTo : Append to element
    //elements : Inner elements to append to this element
    let element = document.createElement(type);

    if (className !== null) element.className = className;
    if (inputType !== null) {
      element.type = inputType;
      if (text !== null) element.value = text;
    } else {
      if (text !== null) {
        if (type.toLowerCase() === 'input') {
          element.value = text;
        } else {
          element.innerText = text;
        }
      }
    }
    if (html !== null) element.innerHTML = html;
    if (opacity !== null) element.style.opacity = opacity;
    if (appendTo !== null) appendTo.appendChild(element);
    if (src !== null) element.src = src;
    if (id !== null) element.id = id;
    if (value !== null) element.value = value;
    if (name !== null) element.name = name;
    if (onClick !== null) element.onclick = onClick;
    if (onMouseMove !== null) element.onmousemove = onMouseMove;
    if (onMouseDown !== null) element.onmousedown = onMouseDown;
    if (onMouseUp !== null) element.onmouseup = onMouseUp;
    if (onMouseOver !== null) element.onmouseover = onMouseOver;
    if (onMouseOut !== null) element.onmouseout = onMouseOut;
    if (onKeyUp !== null) element.onkeyup = onKeyUp;
    if (onKeyDown !== null) element.onkeydown = onKeyDown;
    if (onInput !== null) element.oninput = onInput;
    if (onChange !== null) element.onchange = onChange;
    if (onFocus !== null) element.onfocus = onFocus;
    if (outFocus !== null) element.onfocusout = outFocus;
    if (onBlur !== null) element.onblur = onBlur;
    if (placeholder !== null) element.placeholder = placeholder;
    if (href !== null) element.href = href;
    if (target !== null) element.target = target;
    if (colspan !== null) element.colSpan = colspan;
    if (width !== null) element.width = width;
    if (height !== null) element.height = height;
    if (attributes !== null) {
      Object.keys(attributes).forEach((key) => {
        element.setAttribute(key, attributes[key]);
      });
    }
    if (style !== null) {
      Object.keys(style).forEach((key) => {
        element.style.setProperty(key, style[key]);
      });
    }

    for (let addElement of elements) {
      if (addElement instanceof Element) {
        element.appendChild(addElement);
      } else {
        element.appendChild(Interface.Create(addElement));
      }
    }

    return element;
  }

  /**
   * Displays a global message at the top right of the screen.
   */
  static DisplayGlobalStatus({text, duration, good}) {
    //Create Status
    let status = Interface.Create({
      type: 'div',
      className: 'GlobalStatus Start',
      text: text
    });
    if (good) {
      status.classList.add('Good');
    } else {
      status.classList.add('Bad');
    }

    document.body.appendChild(status);

    //Force reflow of elements
    Interface.ReflowElement(status);

    //Animate status into view
    status.classList.remove('Start');
    status.classList.add('Middle');
    //Wait for showing
    setTimeout(() => {
      //Show for duration
      setTimeout(() => {
        status.classList.remove('Middle');
        status.classList.add('End');
        //Complete removal
        setTimeout(() => {
          status.remove();
        }, 0.5 * 1000);
      }, duration * 1000);
    }, 0.5 * 1000);
  }
}