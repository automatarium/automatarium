import { CustomEvents } from '/src/hooks/useEvent'

/**
 * Creates an event and dispatches it with specified data.
 * This should only be used for custom events
 */
export const dispatchCustomEvent = <T extends keyof CustomEvents>(name: T, detail: CustomEvents[T]) => {
  document.dispatchEvent(new CustomEvent(name, { detail }))
}
