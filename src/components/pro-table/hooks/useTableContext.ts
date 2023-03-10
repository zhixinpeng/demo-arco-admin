import type { Ref } from 'vue';
import { inject, provide } from 'vue';

import { Nullable, ProTableAction } from '../types';

const key = Symbol('pro-table');

type Instance = ProTableAction & {
  wrapRef: Ref<Nullable<HTMLElement>>;
};

export function createTableContext(instance: Instance) {
  provide(key, instance);
}

export function useTableContext(): Instance {
  return inject(key) as Instance;
}
