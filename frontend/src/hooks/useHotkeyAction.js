import { useEffect, useState } from 'react'

import actions from '/src/config/hotkeys'

// Hotkey format
// [{
//   letter: a keyboard letter such as A
//   meta: boolean, is the Command/Ctrl key required?
//   alt: boolean, is the Option/Alt key required?
//   shift: boolean, is the Shift key required?
// }]

const isWindows = navigator.platform.match(/Win/)
const formatHotkey = ({ letter, meta, alt, shift, showCtrl = isWindows }) =>
  `${shift ? '⇧' : ''}${alt ? '⌥' : ''}${meta ? (showCtrl ? '⌃' : '⌘') : ''}${letter.toUpperCase()}`


const useHotkeyAction = (action, callback) => {
  // Get hotkey from action
  const hotkey = actions[action]
  if (!hotkey)
    throw new Error(`No such action with name "${action}"`)

  // Add keydown listener
  useEffect(() => {
    const handleKeyDown = e => {
      // Guard against other keys 
      const keyMatch = e.code === `Key${hotkey.letter.toUpperCase()}`
      const digitMatch = e.code === `Digit${hotkey.letter}`
      const letterMatch = e.key === hotkey.letter
      if (!(keyMatch || digitMatch || letterMatch))
          return

      // Check augmenting keys
      if ((hotkey.meta || false) !== (e.metaKey || e.ctrlKey))
        return
      if ((hotkey.alt || false) !== e.altKey)
        return
      if ((hotkey.shift || false) !== e.shiftKey)
        return

      // Prevent default and exec callback
      e.preventDefault()
      e.stopPropagation()
      callback(e)
    }
    
    // Add listener
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    hotkeyLabel: formatHotkey(hotkey)
  }
}

export default useHotkeyAction
