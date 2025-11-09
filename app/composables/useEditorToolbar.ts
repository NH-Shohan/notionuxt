import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  BrushIcon,
  ChevronDown,
  Code2Icon,
  CodeIcon,
  Heading1,
  Heading2,
  Heading3,
  HighlighterIcon,
  ImageIcon,
  ItalicIcon,
  Link2Icon,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  PaintbrushIcon,
  Quote,
  SigmaIcon,
  SquareSigma,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  TextInitialIcon,
  UnderlineIcon,
  YoutubeIcon,
} from 'lucide-vue-next';
import type { Component } from 'vue';

export interface ToolbarAction {
  icon: Component;
  action: () => void;
}

export function useEditorToolbar(actions: ReturnType<typeof import('./useEditorActions').useEditorActions>) {
  const toolbarActions: ToolbarAction[] = [
    {
      icon: Heading1,
      action: () => actions.toggleHeading(1),
    },
    {
      icon: Heading2,
      action: () => actions.toggleHeading(2),
    },
    {
      icon: Heading3,
      action: () => actions.toggleHeading(3),
    },
    {
      icon: TextInitialIcon,
      action: actions.setParagraph,
    },
    {
      icon: AlignLeftIcon,
      action: () => actions.setTextAlign('left'),
    },
    {
      icon: AlignCenterIcon,
      action: () => actions.setTextAlign('center'),
    },
    {
      icon: AlignRightIcon,
      action: () => actions.setTextAlign('right'),
    },
    {
      icon: AlignJustifyIcon,
      action: () => actions.setTextAlign('justify'),
    },
    {
      icon: BoldIcon,
      action: actions.toggleBold,
    },
    {
      icon: ItalicIcon,
      action: actions.toggleItalic,
    },
    {
      icon: StrikethroughIcon,
      action: actions.toggleStrike,
    },
    {
      icon: UnderlineIcon,
      action: actions.toggleUnderline,
    },
    {
      icon: Link2Icon,
      action: actions.toggleLink,
    },
    {
      icon: CodeIcon,
      action: actions.toggleCode,
    },
    {
      icon: HighlighterIcon,
      action: actions.toggleHighlight,
    },
    {
      icon: SuperscriptIcon,
      action: actions.toggleSuperscript,
    },
    {
      icon: SubscriptIcon,
      action: actions.toggleSubscript,
    },
    {
      icon: Quote,
      action: actions.toggleBlockquote,
    },
    {
      icon: List,
      action: actions.toggleBulletList,
    },
    {
      icon: ListOrdered,
      action: actions.toggleOrderedList,
    },
    {
      icon: Code2Icon,
      action: actions.toggleCodeBlock,
    },
    {
      icon: ChevronDown,
      action: actions.toggleDetails,
    },
    {
      icon: Minus,
      action: actions.setHorizontalRule,
    },
    {
      icon: ImageIcon,
      action: actions.addImage,
    },
    {
      icon: SigmaIcon,
      action: actions.onInsertInlineMath,
    },
    {
      icon: SquareSigma,
      action: actions.onInsertBlockMath,
    },
    {
      icon: ListChecks,
      action: actions.toggleTaskList,
    },
    {
      icon: YoutubeIcon,
      action: actions.addVideo,
    },
    {
      icon: PaintbrushIcon,
      action: actions.toggleBackgroundColor,
    },
    {
      icon: BrushIcon,
      action: actions.toggleTextColor,
    },
  ];

  return {
    toolbarActions,
  };
}
