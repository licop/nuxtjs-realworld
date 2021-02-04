<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="tagInput" type="text" class="form-control" placeholder="Enter tags" @keypress.enter.prevent="addTag(tagInput)">
                  <div class="tag-list">
                    <span
                      class="tag-default tag-pill"
                      v-for="(tag, index) of article.tagList"
                      :key="tag + index"
                    >
                      <i class="ion-close-round" @click="removeTag(tag)"> </i>
                      {{ tag }}
                    </span>
                  </div>
              </fieldset>
              <button @click="publish" class="btn btn-lg pull-xs-right btn-primary"  type="button">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getArticle, newArticle, updateArticle} from '../../api/article'

export default {
  // 在路由匹配组件渲染之前会先执行中间件
  middleware: 'authenticated',
  name: 'EditorIndex',
  async asyncData ({ params }) {
    const slug = params.slug || null
    let article = {
      title: '',
      description: '',
      body: '',
      tagList: []
    }
    if(slug) {
      const { data } = await getArticle(slug)
      article = data.article
    }
    return {
      article,
      slug
    }
  },
  data() {
    return {
      tagInput: null
    }
  },
  methods: {
    async publish () {
      if(this.slug) {
        await updateArticle({article: this.article}, this.slug)
        this.$router.push({
          name: 'article',
          params: {
            slug: this.slug
          }
        })
      } else {
        const { data } = await newArticle({ article: this.article })
        const { article } = data
        this.$router.push({
          name: 'article',
          params: {
            slug: article.slug
          }
        })
      }
    },
    removeTag(tag) {
      this.article.tagList = this.article.tagList.filter(t => t !== tag);
    },
    addTag(tag) {
      this.article.tagList = this.article.tagList.concat([tag])
    }
  }
}

</script>
<style>
</style>