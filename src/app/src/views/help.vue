<template>
  <div class='content'>
    <VueMarkdown class='markdown'>{{contentText}}</VueMarkdown>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import HelpMD from '@/lib/help.md';

export default {
  data() {
    return {
      contentText: HelpMD,
    };
  },
  components: {
    VueMarkdown,
  },
  methods: {},
};
</script>

<style lang='scss' scoped></style>
