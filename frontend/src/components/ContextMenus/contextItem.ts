/**
 * Represents a Context item. These are the things that are shown in popups around the U
 */
export interface ContextItem {
  /**
   * Text shown to the user to explain the item
   */
  label: string
  /**
   * Action that is ran when the item is pressed
   * @see useActions
   */
  action?: string
  shortcut?: string
  // eslint-disable-next-line no-use-before-define
  items?: ContextItems
}

/**
 * A list is made up of context items along with <hr> elements to break them up into sections
 */
export type ContextItems = readonly (ContextItem | 'hr')[]
