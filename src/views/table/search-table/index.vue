<template>
  <a-card class="container" title="查询表格">
    <a-row style="margin-bottom: 16px">
      <a-col :span="12">
        <a-space>
          <a-button type="primary" @click="() => handleEdit()">
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
        </a-space>
      </a-col>
      <a-col
        :span="12"
        style="display: flex; align-items: center; justify-content: end"
      >
        <a-space>
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            下载
          </a-button>
          <a-tooltip content="刷新">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip content="密度">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip content="列表设置">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-space>
      </a-col>
    </a-row>
    <a-table
      v-model:selectedKeys="selectedKeys"
      row-key="id"
      :loading="loading"
      :columns="(cloneColumns as TableColumnData[])"
      :data="renderData"
      :pagination="pagination"
      :row-selection="rowSelection"
      :size="size"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (pagination.current! - 1) * pagination.pageSize! }}
      </template>
      <template #contentType="{ record }: { record: QueryRecord }">
        <a-space>
          <a-avatar
            v-if="record.contentType === 'img'"
            :size="16"
            shape="square"
          >
            <img
              alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image"
            />
          </a-avatar>
          <a-avatar
            v-else-if="record.contentType === 'horizontalVideo'"
            :size="16"
            shape="square"
          >
            <img
              alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77721e365eb2ab786c889682cbc721c1.svg~tplv-49unhts6dw-image.image"
            />
          </a-avatar>
          <a-avatar v-else :size="16" shape="square">
            <img
              alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/ea8b09190046da0ea7e070d83c5d1731.svg~tplv-49unhts6dw-image.image"
            />
          </a-avatar>
          {{ ContentTypeMap[record.contentType] }}
        </a-space>
      </template>
      <template #status="{ record }: { record: QueryRecord }">
        <span v-if="record.status === 'offline'" class="circle"></span>
        <span v-else class="circle pass"></span>
        {{ StatusMap[record.status] }}
      </template>
      <template #operations="{ record }: { record: QueryRecord }">
        <a-button type="text" size="small">事件查询</a-button>
        <a-button type="text" size="small" @click="() => handleEdit(record)"
          >编辑</a-button
        >
      </template>
    </a-table>
    <edit-modal
      :visible="editVisible"
      :record="currentEditRecord"
      @close="handleClose"
      @ok="handleClose"
    />
  </a-card>
</template>

<script setup lang="ts">
  import { computed, nextTick, onBeforeMount, reactive, ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import { fetchQueryList, QueryParams, QueryRecord } from '@/api/table';
  import { Message } from '@arco-design/web-vue';
  import type {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import type { PaginationProps } from '@arco-design/web-vue/es/pagination/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { ContentTypeMap, StatusMap, BasePagination } from './constants';
  import EditModal from './eidt-modal.vue';

  const editVisible = ref(false);
  let currentEditRecord = reactive<QueryRecord>({} as QueryRecord);

  const handleEdit = (record?: QueryRecord) => {
    editVisible.value = true;
    currentEditRecord = record || ({} as QueryRecord);
  };
  const handleClose = () => {
    editVisible.value = false;
  };

  const { loading, setLoading } = useLoading(true);
  const renderData = ref<QueryRecord[]>([]);
  const columns = computed<(TableColumnData & { hideInSetting?: true })[]>(
    () => [
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
        hideInSetting: true,
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
        slotName: 'operations',
        hideInSetting: true,
      },
    ]
  );
  const pagination = reactive<PaginationProps>({
    ...BasePagination,
    showPageSize: true,
    showTotal: true,
  });
  const rowSelection: TableRowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    showCheckedAll: true,
  });
  const selectedKeys = ref<string[]>([]);

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  const size = ref<SizeProps>('medium');
  const densityList = computed(() => [
    {
      name: '迷你',
      value: 'mini',
    },
    {
      name: '偏小',
      value: 'small',
    },
    {
      name: '中等',
      value: 'medium',
    },
    {
      name: '偏大',
      value: 'large',
    },
  ]);
  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined
  ) => {
    size.value = val as SizeProps;
  };

  type Column = TableColumnData & { checked?: true; hideInSetting?: true };
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };
  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        // eslint-disable-next-line no-new
        new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };
  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };
  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(
        cloneColumns.value.filter((item) => !item.hideInSetting)
      );
    },
    { deep: true, immediate: true }
  );

  // 获取列表数据
  const fetchData = async (params?: QueryParams) => {
    setLoading(true);
    try {
      const { data } = await fetchQueryList({
        ...params,
        pageSize: pagination.pageSize,
        pageNo: pagination.current,
      });
      renderData.value = data.list;
      pagination.total = data.total;
    } catch (err) {
      Message.error({ content: err as string });
    } finally {
      setLoading(false);
    }
  };

  onBeforeMount(() => {
    fetchData();
  });

  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData();
  };
  const onPageSizeChange = (pageSize: number) => {
    pagination.pageSize = pageSize;
    fetchData();
  };
  const search = () => {
    pagination.current = 1;
    fetchData();
  };
</script>

<style lang="less" scoped>
  .container {
    margin: 8px 20px 20px;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
