<template>
  <a-modal
    :title="record.id ? '编辑' : '新建'"
    :visible="props.visible"
    @cancel="handleCancel"
    @ok="handleOk"
    >这是一个弹窗</a-modal
  >
</template>

<script setup lang="ts">
  import { QueryRecord } from '@/api/table';
  import { defineProps, defineEmits } from 'vue';

  interface Props {
    visible: boolean;
    record: QueryRecord;
  }

  const props = defineProps<Props>();

  const emit = defineEmits(['close', 'ok']);
  const handleCancel = () => {
    emit('close', {
      value: false,
      key: props.visible,
    });
  };
  const handleOk = () => {
    emit('ok', {
      value: false,
      key: props.visible,
    });
  };
</script>

<style lang="less" scoped></style>
