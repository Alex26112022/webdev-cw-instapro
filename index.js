import { addPost, getPosts, getUserPosts, toLikeApi } from './api.js';
import { renderAddPostPageComponent } from './components/add-post-page-component.js';
import { renderAuthPageComponent } from './components/auth-page-component.js';
import { renderLoadingPageComponent } from './components/loading-page-component.js';
import {
  renderPostsPageComponent,
  renderUserPostsPageComponent,
} from './components/posts-page-component.js';
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from './helpers.js';
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from './routes.js';

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      /* Если пользователь не авторизован, то отправляем его на страницу авторизации перед добавлением поста */
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // @@TODO: реализовать получение постов юзера из API
      page = USER_POSTS_PAGE;
      renderApp();
      return getUserPosts({ token: getToken(), userId: data.userId })
        .then((newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(USER_POSTS_PAGE);
        });
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error('страницы не существует');
};

const renderApp = () => {
  const appEl = document.getElementById('app');
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // @TODO: реализовать добавление поста в API
        console.log('Добавляю пост...', { description, imageUrl });
        addPost({
          token: getToken(),
          description: description,
          imageUrl: imageUrl,
        }).then((newPost) => {
          console.log('Пост добавлен', newPost);
          goToPage(POSTS_PAGE);
        });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // @TODO: реализовать страницу с фотографиями отдельного пользвателя
    return renderUserPostsPageComponent({ appEl });
  }
};

export function toLike(button) {
  console.log('Кликаю лайк...');
  const postId = button.dataset.postId;
  const img = button.querySelector('img');
  const src = img.getAttribute('src');
  const filename = src.split('/').pop();
  const action = filename === 'like-active.svg' ? 'dislike' : 'like';
  const postEl = button.closest('.post');
  const likesCounter = postEl.querySelector('.post-likes-text strong');

  toLikeApi({ token: getToken(), liked: action, postId })
    .then((post) => {
      img.setAttribute(
        'src',
        `./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}`
      );
      likesCounter.textContent = post.likes.length;
      console.log('Лайк изменен', post.isLiked);
    })
    .catch((err) => console.error('Не удалось изменить лайк:', err));
}

goToPage(POSTS_PAGE);
