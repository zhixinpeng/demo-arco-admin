import { ProFormProps } from '@/components/pro-form/types';
import { Recordable } from '@/types/common';
import { isFunction } from 'lodash';
import { computed, ComputedRef, Slots, unref, Ref } from 'vue';
import { ProTableProps } from '../types';

export function useTableForm(
  propsRef: ComputedRef<ProTableProps>,
  slots: Slots,
  fetchData: (info?: Recordable) => Promise<void>
) {
  const getFormProps = computed((): Partial<ProFormProps> => {
    const { formConfig, title } = unref(propsRef);
    return {
      title,
      ...formConfig,
    };
  });

  const handleFormSubmit = (info: Recordable) => {
    const { beforeSearch } = unref(propsRef);
    if (beforeSearch && isFunction(beforeSearch)) {
      info = beforeSearch(info) || info;
    }
    fetchData(info);
  };

  return {
    getFormProps,
    handleFormSubmit,
  };
}
