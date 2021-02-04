<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            
            <div v-if="isSelf">
              <nuxt-link
                class="btn btn-sm btn-outline-secondary action-btn"
                :to="{ name: 'settings' }"
              >
                <i class="ion-gear-a"></i> Edit Profile Settings
              </nuxt-link>
            </div>
            <div v-else>
              <button
                class="btn btn-sm btn-secondary action-btn"
                v-if="profile.following"
                @click.prevent="unfollow()"
              >
                <i class="ion-plus-round"></i> &nbsp;Unfollow
                {{ profile.username }}
              </button>
              <button
                class="btn btn-sm btn-outline-secondary action-btn"
                v-if="!profile.following"
                @click.prevent="follow()"
              >
                <i class="ion-plus-round"></i> &nbsp;Follow
                {{ profile.username }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  exact
                  :class="{
                    active: tab === 'my'
                  }"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    },
                    query: {
                      tab: 'my'
                    }
                  }"
                >
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  exact
                  :class="{
                    active: tab === 'favorited'
                  }"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    },
                    query: {
                      tab: 'favorited'
                    }
                  }"
                >
                  Favorited Articles
                </nuxt-link>
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
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button 
                class="btn btn-outline-primary btn-sm pull-xs-right" 
                :class="{active: article.favorited}"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link 
              :to="{
                name: 'article',
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
                    tag: $route.query.tag,
                    tab
                  }
                }">{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
       
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, follow, unFollow } from '../../api/profile'
import { getArticles, deleteFavorite, addFavorite } from '../../api/article'

export default {
  name: 'ProfileIndex',

  async asyncData ({ params, query, store }) {
    const username = params.username
    const page = Number.parseInt(query.page || 1)
    const tab = query.tab || 'my'
    const limit = 15
    const { data: profileData}  = await getProfile(username)
    
    const profile = profileData.profile
    const { data: articleData } = store.state.user && tab === 'favorited' ? await getArticles({
        favorited: profile.username,
        limit, 
        offset: (page - 1) * limit
      }) : await getArticles({
        author: profile.username,
        limit, 
        offset: (page - 1) * limit
      })
    const {articles, articlesCount} = articleData

    return {
      profile,
      articles,
      articlesCount,
      tab,
      limit,
      page
    }
  },
  watchQuery: ['page', 'tab'],
  computed: {
    isSelf() {
      return this.profile.username === this.$store.state.user.username
    },
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    } 
  },
  methods: {
    follow() {
      follow(this.profile.username)
    },
    unfollow() {
      unFollow(this.profile.username)
    },
    async onFavorite (article) {
      article.favoriteDisabled = true
      if(article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
  }
}
</script>

<style>

</style>