import { Recordable } from '@/types/common';
import { cloneDeep } from 'lodash';
import { Ref, unref, toRaw, ComputedRef } from 'vue';
import { defaultValueComponents } from '../shared';
import { ProFormAction, ProFormSchema } from '../types';

interface UseFormActionContext {
  emit: (event: 'submit', ...args: any[]) => void;
  formModel: Recordable;
  formRef: Ref<ProFormAction>;
  getSchema: ComputedRef<ProFormSchema[]>;
  defaultValueRef: Ref<Recordable>;
}

export function useFormEvents(context: UseFormActionContext) {
  const { emit, formModel, formRef, getSchema, defaultValueRef } = context;

  async function submit(): Promise<void> {
    const form = unref(formRef);
    if (!form) return;
    emit('submit', toRaw(formModel));
  }

  async function reset(): Promise<void> {
    const form = unref(formRef);
    if (!form) return;
    Object.keys(formModel).forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      const isInput =
        schema?.component && defaultValueComponents.includes(schema.component);
      const defaultValue = cloneDeep(defaultValueRef.value[key]);
      formModel[key] = isInput ? defaultValue || '' : defaultValue;
    });
    submit();
  }

  return {
    submit,
    reset,
  };
}
