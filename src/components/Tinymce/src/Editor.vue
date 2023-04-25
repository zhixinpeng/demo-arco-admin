<template>
  <div class="tinymce-container" :style="{ width: containerWidth }">
    <textarea
      v-if="!initOptions.inline"
      :id="tinymceId"
      ref="elRef"
      :style="{ visibility: 'hidden' }"
    ></textarea>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
  import type { Editor, RawEditorSettings } from 'tinymce';
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/silver';
  import 'tinymce/icons/default/icons';
  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/anchor';
  import 'tinymce/plugins/autolink';
  import 'tinymce/plugins/autosave';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/codesample';
  import 'tinymce/plugins/directionality';
  import 'tinymce/plugins/fullscreen';
  import 'tinymce/plugins/hr';
  import 'tinymce/plugins/insertdatetime';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/media';
  import 'tinymce/plugins/nonbreaking';
  import 'tinymce/plugins/noneditable';
  import 'tinymce/plugins/pagebreak';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/preview';
  import 'tinymce/plugins/print';
  import 'tinymce/plugins/save';
  import 'tinymce/plugins/searchreplace';
  import 'tinymce/plugins/spellchecker';
  import 'tinymce/plugins/tabfocus';
  // import 'tinymce/plugins/table';
  import 'tinymce/plugins/template';
  import 'tinymce/plugins/textpattern';
  import 'tinymce/plugins/visualblocks';
  import 'tinymce/plugins/visualchars';
  import 'tinymce/plugins/wordcount';

  import {
    defineComponent,
    computed,
    nextTick,
    ref,
    unref,
    watch,
    onDeactivated,
    onBeforeUnmount,
    PropType,
  } from 'vue';
  import { isNumber } from '@/utils/is';
  import { Recordable } from '@/types/common';
  import { toolbar, plugins } from './tinymce';
  import { bindHandlers, buildShortUUID, onMountedOrActivated } from './helper';

  const tinymceProps = {
    options: {
      type: Object as PropType<Partial<RawEditorSettings>>,
      default: () => ({}),
    },
    value: {
      type: String,
    },

    toolbar: {
      type: Array as PropType<string[]>,
      default: toolbar,
    },
    plugins: {
      type: Array as PropType<string[]>,
      default: plugins,
    },
    modelValue: {
      type: String,
    },
    height: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 400,
    },
    width: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 'auto',
    },
    showImageUpload: {
      type: Boolean,
      default: true,
    },
  };

  export default defineComponent({
    name: 'Tinymce',
    inheritAttrs: false,
    props: tinymceProps,
    emits: ['change', 'update:modelValue', 'inited', 'initError'],
    setup(props, { emit, attrs }) {
      const editorRef = ref<Editor | null>(null);
      const fullscreen = ref(false);
      const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
      const elRef = ref<HTMLElement | null>(null);

      const tinymceContent = computed(() => props.modelValue);

      const containerWidth = computed(() => {
        const { width } = props;
        if (isNumber(width)) {
          return `${width}px`;
        }
        return width;
      });

      const initOptions = computed((): RawEditorSettings => {
        const { height, options } = props;

        return {
          selector: `#${unref(tinymceId)}`,
          height,
          toolbar: props.toolbar,
          menubar: 'file edit insert view format table',
          plugins: props.plugins,
          language_url: `/tinymce/langs/zh_CN.js`,
          language: 'zh_CN',
          branding: false,
          default_link_target: '_blank',
          link_title: false,
          object_resizing: false,
          auto_focus: true,
          skin: 'oxide',
          skin_url: `/tinymce/skins/ui/oxide`,
          content_css: `/tinymce/skins/ui/oxide/content.min.css`,
          ...options,
          setup: (editor: Editor) => {
            editorRef.value = editor;
            editor.on('init', (e) => initSetup(e));
          },
        };
      });

      const disabled = computed(() => {
        const { options } = props;
        const getdDisabled = options && Reflect.get(options, 'readonly');
        const editor = unref(editorRef);
        if (editor) {
          editor.setMode(getdDisabled ? 'readonly' : 'design');
        }
        return getdDisabled ?? false;
      });

      watch(
        () => attrs.disabled,
        () => {
          const editor = unref(editorRef);
          if (!editor) {
            return;
          }
          editor.setMode(attrs.disabled ? 'readonly' : 'design');
        }
      );

      onMountedOrActivated(() => {
        if (!initOptions.value.inline) {
          tinymceId.value = buildShortUUID('tiny-vue');
        }
        nextTick(() => {
          setTimeout(() => {
            initEditor();
          }, 30);
        });
      });

      onBeforeUnmount(() => {
        destory();
      });

      onDeactivated(() => {
        destory();
      });

      function destory() {
        if (tinymce !== null) {
          tinymce?.remove?.(unref(initOptions).selector ?? '');
        }
      }

      function initEditor() {
        const el = unref(elRef);
        if (el) {
          el.style.visibility = '';
        }
        tinymce
          .init(unref(initOptions))
          .then((editor) => {
            emit('inited', editor);
          })
          .catch((err) => {
            emit('initError', err);
          });
      }

      function initSetup(e: Event) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const value = props.modelValue || '';

        editor.setContent(value);
        bindModelHandlers(editor);
        bindHandlers(e, attrs, unref(editorRef));
      }

      function setValue(editor: Recordable, val: string, prevVal?: string) {
        if (
          editor &&
          typeof val === 'string' &&
          val !== prevVal &&
          val !== editor.getContent({ format: attrs.outputFormat })
        ) {
          editor.setContent(val);
        }
      }

      function bindModelHandlers(editor: any) {
        const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
        const normalizedEvents = Array.isArray(modelEvents)
          ? modelEvents.join(' ')
          : modelEvents;

        watch(
          () => props.modelValue,
          (val: any, prevVal: any) => {
            setValue(editor, val, prevVal);
          }
        );

        watch(
          () => props.value,
          (val: any, prevVal: any) => {
            setValue(editor, val, prevVal);
          },
          {
            immediate: true,
          }
        );

        editor.on(normalizedEvents || 'change keyup undo redo', () => {
          const content = editor.getContent({ format: attrs.outputFormat });
          emit('update:modelValue', content);
          emit('change', content);
        });

        editor.on('FullscreenStateChanged', (e: any) => {
          fullscreen.value = e.state;
        });
      }

      return {
        containerWidth,
        initOptions,
        tinymceContent,
        elRef,
        tinymceId,
        editorRef,
        fullscreen,
        disabled,
      };
    },
  });
</script>

<style lang="less">
  .tinymce-container {
    position: relative;
    line-height: normal;

    textarea {
      z-index: -1;
      visibility: hidden;
    }
  }
</style>
