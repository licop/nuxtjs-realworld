<template>
  <div class="article-meta">
    
    <nuxt-link :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link 
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: article.author.username
          }
        }"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <template v-if="!isSelf">
      <button
        class="btn btn-sm btn-outline-secondary"
        v-if="profile.following"
        :class="{
          active: profile.following
        }"
        @click.prevent="unfollow()"
      >
        <i class="ion-plus-round"></i> &nbsp;Unfollow
        {{ profile.username }}
      </button>
      <button
        class="btn btn-sm btn-outline-secondary"
        v-if="!profile.following"
        :class="{
          active: profile.following
        }"
        @click.prevent="follow()"
      >
        <i class="ion-plus-round"></i> &nbsp;Follow
        {{ profile.username }}
      </button>
      &nbsp;
      <button 
        class="btn btn-sm btn-outline-primary"
        @click="onFavorite()"
        :class="{
          active: article.favorited
        }"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{ article.Favorite ? 'Unfavorite' : 'Favorite' }} Post <span class="counter">({{ article.favoritesCount}})</span>
      </button>
    </template>
    <template v-else>
      <nuxt 
        class="btn btn-outline-secondary btn-sm" 
        :to="{
          name: editArticle,
          params: {
            slug: article.slug
          }
        }">
        <i class="ion-edit"></i> Edit Article
      </nuxt>
      &nbsp;
     <button 
      class="btn btn-outline-danger btn-sm" 
      @click="deleteArticle()"
    >
      <i class="ion-trash-a"></i> Delete Article
    </button>
    </template>
  </div>
</template>

<script>
import { deleteArticle, deleteFavorite, addFavorite } from '../../../api/article'
import { getProfile, follow, unFollow } from '../../../api/profile'


export default {
  name: 'article-meta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      profile: {} 
    }
  },
  async mounted () {
    const { data: profileData}  = await getProfile(this.article.author.username)
    
    this.profile = profileData.profile
  },
  
  computed: {
    isSelf () {
      return this.article.author.username === this.$store.state.user.username
    }
  },
  methods: {
    deleteArticle() {
      deleteArticle(this.article.slug)
    },
    async onFavorite () {
      this.article.favoriteDisabled = true
      if(this.article.favorited) {
        // 取消点赞
        await deleteFavorite(this.article.slug)
        this.article.favorited = false
        this.article.favoritesCount += -1
      } else {
        await addFavorite(this.article.slug)
        this.article.favorited = true
        this.article.favoritesCount += 1
        this.article.favoriteDisabled = false
      }
    },
    follow() {
      follow(this.profile.username)
    },
    unfollow() {
      unFollow(this.profile.username)
    }
  }
}
</script>

<style></style>
