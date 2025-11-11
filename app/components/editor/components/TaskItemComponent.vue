<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';
import { Checkbox } from '@/components/ui/checkbox';

const props = defineProps(nodeViewProps);

function updateChecked(checked: boolean) {
  props.updateAttributes({
    checked,
  });
}
</script>

<template>
  <NodeViewWrapper
    as="li"
    :data-type="node.type.name"
    :data-checked="node.attrs.checked"
  >
    <label :contenteditable="false">
      <Checkbox
        :checked="node.attrs.checked"
        @update:checked="updateChecked"
      />
    </label>
    <NodeViewContent as="div" />
  </NodeViewWrapper>
</template>

