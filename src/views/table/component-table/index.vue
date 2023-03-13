<template>
  <a-card class="container">
    <ProTable
      ref="tableRef"
      row-key="id"
      title="表格组件"
      :request="onRequest"
      :columns="columns"
      :form-config="formConfig"
      :row-selection="{ type: 'checkbox', showCheckedAll: true }"
      @header-click="handleHeaderClick"
      @selection-change="handleSelectAll"
    >
      <template #action>
        <a-button type="primary">
          <template #icon>
            <icon-plus />
          </template>
          新建
        </a-button>
        <a-upload action="/">
          <template #upload-button>
            <a-button>上传</a-button>
          </template>
        </a-upload>
      </template>
      <template #toolbar>
        <a-button type="primary" size="small" @click="handleTriggerTableMethod">
          全选
        </a-button>
      </template>
      <template #operations="{ record }: { record: QueryRecord }">
        <a-button type="text" size="small">事件查询{{ record.name }}</a-button>
        <a-button type="text" size="small">编辑</a-button>
      </template>
    </ProTable>
  </a-card>
</template>

<script setup lang="ts">
  import { ProTable, ProTableAction } from '@/components/pro-table';
  import { fetchQueryList } from '@/api/table';
  import { ProColumnData } from '@/components/pro-table/types';
  import { computed, ref, unref } from 'vue';
  import { Nullable } from '@/types/common';
  import { ProFormProps } from '@/components/pro-form';

  const tableRef = ref<Nullable<ProTableAction>>(null);
  const onRequest = async (params: any) => {
    const res = await fetchQueryList({
      ...params,
    });
    return { data: res.data.list, total: res.data.total };
  };
  const isSelectAll = ref(false);

  const handleTriggerTableMethod = () => {
    const table = unref(tableRef);
    table?.selectAll(!isSelectAll.value);
  };

  const handleHeaderClick = (column: ProColumnData) => {
    console.log(column);
  };

  const handleSelectAll = (rowkeys: (string | number)[]) => {
    console.log(rowkeys);
  };

  const columns = computed<ProColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'id',
      slotName: 'index',
    },
    {
      title: '集合编号',
      dataIndex: 'number',
    },
    {
      title: '集合名称',
      dataIndex: 'name',
    },
    {
      title: '内容体裁',
      dataIndex: 'contentType',
      slotName: 'contentType',
    },
    {
      title: '筛选方式',
      dataIndex: 'filterType',
    },
    {
      title: '内容量',
      dataIndex: 'count',
      defaultHidden: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const formConfig = computed<Partial<ProFormProps>>(() => ({
    schemas: [
      {
        field: 'name',
        label: '集合名称',
        component: 'Input',
        props: {
          showColon: true,
        },
      },
      {
        field: 'name1',
        label: '集合名称',
        component: 'Input',
        props: {
          showColon: true,
        },
      },
      {
        field: 'name2',
        label: '集合名称',
        component: 'Input',
        props: {
          showColon: true,
        },
      },
      {
        field: 'name3',
        label: '集合名称',
        component: 'Input',
        props: {
          showColon: true,
        },
      },
      {
        field: 'contentType',
        label: '内容体裁',
        component: 'Select',
        componentProps: {
          options: [
            {
              value: '1',
              label: '1',
            },
            {
              value: '2',
              label: '2',
            },
          ],
        },
        props: {
          showColon: true,
        },
      },
    ],
  }));
</script>

<style lang="less" scoped>
  .container {
    margin: 8px 20px 20px;
  }
</style>
