import 'font-awesome-webpack';
import {default as CodeMirror} from 'CodeMirror';
window.CodeMirror = CodeMirror;

import './css/index.css';

import {default as menu} from './js/menu';
import {default as tabs} from './js/tabs';

menu();
tabs();
