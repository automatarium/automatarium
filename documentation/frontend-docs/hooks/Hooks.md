# Hooks

How individual custom hooks work and gives examples of where they are used.

As an overview: something something something here.

### Table of contents

- [Hooks](#hooks)
    - [Table of contents](#table-of-contents)
- [useActions](#useactions)
- [useAuth](#useauth)
- [useAutosaveProject](#useautosaveproject)
- [useComment__](#usecomment__)
  - [useCommentCreation](#usecommentcreation)
  - [useCommentDragging](#usecommentdragging)
  - [useCommentSelection](#usecommentselection)
- [useContextMenus](#usecontextmenus)
- [useDeleteTool](#usedeletetool)
- [useEvent](#useevent)
- [useImageExport](#useimageexport)
- [useResource__](#useresource__)
  - [useResourceDragging](#useresourcedragging)
  - [useResourceSelection](#useresourceselection)
- [useState__](#usestate__)
  - [useStateCreation](#usestatecreation)
  - [useStateDragging](#usestatedragging)
  - [useStateSelection](#usestateselection)
- [useSyncCurrentProject](#usesynccurrentproject)
- [useSyncProject](#usesyncproject)
- [useTransition__](#usetransition__)
  - [useTransitionCreation](#usetransitioncreation)
  - [useTransitionSelection](#usetransitionselection)

# useActions



# useAuth


# useAutosaveProject


# useComment__

## useCommentCreation

## useCommentDragging

## useCommentSelection

Selects the 'comment' object from the  ``store``. It is also set to be referred to as ``'comment'``. 

For example, it can be used with useEvent:

```
 useEvent('comment:mousedown', event => {
       // Logic here.
 })
```

# useContextMenus


# useDeleteTool
The delete tool consists of ultilising the prominent custom hook of ``useEvent``. It follows the default MouseEvent syntax such as 
mousedown, but specific selects states, comments and transitions.

The states, transistions and comments are selected using the three hooks: ``useStateSelection, useTransitionSelection, useCommentSelection``.
These three corresponding hooks retrieve the needed elements to select in order for the ``useDeleteTool`` to have element/s to delete. 

Likewise, the delete tool hook contains methods to recognise the users click events and consists of logic for the resembling actions. For example, when the delete tool is selected and used on a state, the ``useEvent`` selects that state and deletes the state from the ``store`` (refer to ``useProjectStore``  for more information on the store). 

# useEvent

useEvent is essentially equivalent to the UI events for ``MouseEvent``. Except useEvent has more to utilise. 

# useImageExport


# useResource__

## useResourceDragging

## useResourceSelection


# useState__

## useStateCreation

## useStateDragging

## useStateSelection

Selects the 'state' object from the  ``store``. It is also set to be referred to as ``'state'``. 

For example, it can be used with useEvent:

```
 useEvent('state:mousedown', event => {
       // Logic here.
 })
```

# useSyncCurrentProject


# useSyncProject


# useTransition__
## useTransitionCreation
## useTransitionSelection

Selects the 'transition' object from the  ``store``. It is also set to be referred to as ``'transition'``. 

For example, it can be used with useEvent:

```
 useEvent('tranisition:mouseup', event => {
       // Logic here.
 })
```
