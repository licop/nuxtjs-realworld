<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link disabled" href="">Your Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">Global Feed</a>
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for='article in articles' :key="article.slug">
          
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                <img :src="article.author.image" />
              </nuxt-link >
              <div class="info">
                <nuxt-link :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }" href="" class="author">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt }}</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right" :class="{active: article.favorited}">
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link 
              :to="{
                name: 'acticle',
                params: {
                  slug: article.slug
                }
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-----分页列表------>
          <nav>
            <ul class="pagination">
              <li 
                class="page-item"
                :class="{
                  active: item === page
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link class="page-link" :to="{
                  name: 'home',
                  query: {
                    page: item,
                    tag: $route.query.tag
                  }
                }">{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link 
                :to="{
                  name: 'home',
                  query: {
                    tag: tag
                  }
                }"
                class="tag-pill tag-default"
                v-for="tag in tags"
                :key="tag"
              >
                {{ tag }} 
              </nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getArticles } from '../../api/article'
import { getTags } from '../../api/tag'

export default {
  name: 'HomeIndex',
  async asyncData ({ query }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 15
    // 多个异步操作，没有依赖，并行请求两个接口
    const [articleRes, tagRes] = await Promise.all([
      getArticles({ 
        limit, 
        offset: (page - 1) * limit,
        tag: 'AngularJS'
      }),
      getTags()
    ])
    console.log(query.tag, page, 131);
    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data

    return {
      articles,
      articlesCount,
      limit,
      page,
      tags
    }
  },

  watchQuery: ['page', 'tag'],
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  }

}
</script>

<style>
</style>