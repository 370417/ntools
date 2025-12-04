/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'
import { EditorApp } from './Editor.tsx'

const root = document.getElementById('root')

render(() => <EditorApp />, root!)
