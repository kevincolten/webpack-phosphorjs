import {
  Message
} from 'phosphor-messaging';

import {
  TabPanel
} from 'phosphor-tabs';

import {
  ResizeMessage, Widget
} from 'phosphor-widget';

import '../css/tabs.css';


/**
 * A widget which hosts a CodeMirror editor.
 */
class CodeMirrorWidget extends Widget {

  constructor(config) {
    super();
    this.addClass('CodeMirrorWidget');
    this._editor = CodeMirror(this.node, config);
  }

  get editor() {
    return this._editor;
  }

  loadTarget(target) {
    var doc = this._editor.getDoc();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', target);
    xhr.onreadystatechange = () => doc.setValue(xhr.responseText);
    xhr.send();
  }

  onAfterAttach(msg) {
    this._editor.refresh();
  }

  onResize(msg) {
    if (msg.width < 0 || msg.height < 0) {
      this._editor.refresh();
    } else {
      this._editor.setSize(msg.width, msg.height);
    }
  }
}


/**
 * A widget which disposes itself when closed.
 *
 * By default, a widget will only remove itself from the hierarchy.
 */
class ContentWidget extends Widget {

  constructor(title) {
    super();
    this.addClass('content');
    this.addClass(title.toLowerCase());
    this.title.text = title;
    this.title.closable = true;
  }

  onCloseRequest(msg) {
    this.dispose();
  }
}


/**
 * A title generator function.
 */
var nextTitle = (() => {
  var i = 0;
  var titles = ['Red', 'Yellow', 'Green', 'Blue'];
  return () => titles[i++ % titles.length];
})();


/**
 * Add a new content widget the the given tab panel.
 */
function addContent(panel) {
  var content = new ContentWidget(nextTitle());
  panel.addChild(content);
}


/**
 * The main application entry point.
 */
module.exports = function() {
  var panel = new TabPanel();
  panel.id = 'main';
  panel.title.text = 'Demo';
  panel.tabsMovable = true;

  var btn = document.createElement('button');
  btn.textContent = 'Add New Tab';
  btn.onclick = () => addContent(panel);

  var demoArea = new Widget();
  demoArea.title.text = 'Demo';
  demoArea.node.appendChild(btn);

  var cmSource = new CodeMirrorWidget({
    mode: 'text/typescript',
    lineNumbers:true,
    tabSize: 2
  });
  // cmSource.loadTarget('./index.ts');
  cmSource.title.text = 'Source';

  var cmCss = new CodeMirrorWidget({
    mode: 'text/css',
    lineNumbers: true,
    tabSize: 2
  });
  // cmCss.loadTarget('./index.css');
  cmCss.title.text = 'CSS';

  panel.addChild(demoArea);
  panel.addChild(cmSource);
  panel.addChild(cmCss);

  panel.attach(document.body);

  window.onresize = () => { panel.update(); };
}
