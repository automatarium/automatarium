import { useEffect, useState } from 'react'

import actions from '/src/config/hotkeys'

// Hotkey format
// [{
//   letter: a keyboard letter such as A
//   meta: boolean, is the Command/Ctrl key required?
//   alt: boolean, is the Option/Alt key required?
//   shift: boolea, is the Shift key required?
// }]

const formatHotkey = ({ letter, meta, alt, shift }) =>
  `${shift ? '⇧' : ''}${alt ? '⌥' : ''}${meta ? '⌘' : ''}${letter.toUpperCase()}`


const useHotkeyAction = (actionKey, callback) => {
  // Get hotkey from action
  const hotkey = actions[actionKey]
  if (!hotkey)
    throw new Error(`No such action "${actionKey}"`)

  // Add keydown listener
  useEffect(() => {
    const handleKeyDown = e => {
      // Guard against other keys 
      if (e.code !== `Key${hotkey.letter.toUpperCase()}`)
        return
      if (hotkey.meta && !(e.metaKey || e.ctrlKey))
        return
      if (hotKey.alt && !e.altKey)
        return
      if (hotKey.shift && !e.shiftKey)
        return

      // Prevent default and exec callback
      e.preventDefault()
      callback(e)
    }
    
    // Add listener
    document.addEventListener('keydown', handleKeyDown)
    return document.removeEventListener('keydown', handleKeyDown)
  })

  return {
    hotkey,
    formatHotkey(hotkey)
  }
}
