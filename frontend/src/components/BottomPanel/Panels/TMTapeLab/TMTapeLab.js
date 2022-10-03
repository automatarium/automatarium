import { useState, useCallback, useMemo, useEffect } from 'react'
import { SkipBack, ChevronLeft, ChevronRight, SkipForward, Plus, Trash2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

import { useDibEgg } from '/src/hooks'
import { SectionLabel, Button, Input, TracePreview, TraceStepBubble, Preference, Switch } from '/src/components'
import { useProjectStore } from '/src/stores'
import { testingLab }

import {
  StepButtons,
  MultiTraceRow,
  RemoveButton,
  Wrapper,
  TraceConsole,
  StatusIcon,
  WarningLabel,
} from './tmTapeLabStyle'

const TMTapeLab = () => {
  // const multiTraceOutput = props.multiTraceOutput

}

export default TMTapeLab
