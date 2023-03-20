<script setup lang="ts">
  import { QueryRecord } from '@/api/table';

  interface Props {
    visible: boolean;
    record: QueryRecord;
  }

  const props = defineProps<Props>();

  const emit = defineEmits(['cancel', 'ok']);

  const handleCancel = () => {
    emit('cancel');
  };

  const handleOk = async () => {
    // 如果需要传递参数到父组件进行处理就需要使用 emit('ok', props.record);
    // 如果只是通知父组件关闭弹窗就可以使用 emit('ok');
    emit('ok', props.record);
  };
</script>

<template>
  <a-modal
    :title="record.id ? '编辑' : '新建'"
    :visible="props.visible"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    这是一个弹窗
  </a-modal>
</template>
